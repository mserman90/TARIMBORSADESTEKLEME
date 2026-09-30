import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface NewsItem {
  title: string;
  link: string;
  source: string;
  pubDate: string;
}

interface DorkResult extends NewsItem {
  topic: string;
  amounts: string[];
  percents: string[];
  dates: string[];
  years: string[];
  orgs: string[];
  score: number;
}

const DORKS = [
  { topic: "destek", query: '"mazot ve gübre desteği" çiftçi' },
  { topic: "destek", query: "site:tarimorman.gov.tr destek" },
  { topic: "destek", query: '"çiftçi kayıt sistemi" ÇKS 2027' },
  { topic: "destek", query: "ziraat başak kart destek ödemesi" },
  { topic: "fiyat", query: 'TMO "alım fiyat" buğday' },
  { topic: "fiyat", query: '"çiğ süt" fiyat konsey' },
  { topic: "fiyat", query: "gübre fiyatları çiftçi maliyet" },
  { topic: "iklim", query: "zirai don uyarısı meteoroloji çiftçi" },
  { topic: "iklim", query: "kuraklık çiftçi zarar tarım" },
  { topic: "hibe", query: "IPARD hibe çağrı TKDK" },
  { topic: "hibe", query: '"tarım kredi" kooperatife faiz çiftçi' },
];

const KEYWORDS = [
  "destek", "ödeme", "yatı", "alı", "fiyat", "uyarı", "hibe",
  "çağrı", "çiftçi", "buğday", "mazot", "gübre", "tmo", "çks",
];

const ORGS = [
  "Tarım ve Orman Bakanlığı", "Bakanlık", "TMO", "ÇKS", "TARSİM", "TKDK",
  "IPARD", "Ziraat Bankası", "Ziraat", "Tarım Kredi", "Meteoroloji",
  "Ulusal Süt Konseyi", "Ticaret Borsası", "DSİ",
];

function decodeEntities(s: string): string {
  return s
    .replace(/<!\[CDATA\[|\]\]>/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&nbsp;/g, " ")
    .trim();
}

function parseRss(xml: string, fallbackSource: string): NewsItem[] {
  const items: NewsItem[] = [];
  for (const m of xml.matchAll(/<item[\s>][\s\S]*?<\/item>/g)) {
    const b = m[0];
    const get = (tag: string) => {
      const mm = b.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`));
      return mm ? decodeEntities(mm[1]) : "";
    };
    const title = get("title");
    if (!title) continue;
    const src = b.match(/<source[^>]*>([\s\S]*?)<\/source>/);
    const source = src ? decodeEntities(src[1]) : fallbackSource;
    const clean = title.replace(/\s*[-|–]\s*[^-|–]{2,40}$/, (t) =>
      t.trim().toLowerCase() === source.toLowerCase() ? "" : t
    ).trim();
    items.push({
      title: clean || title,
      link: get("link"),
      source,
      pubDate: get("pubDate"),
    });
  }
  return items.slice(0, 20);
}

function extractIntelligence(text: string) {
  const amounts = new Set<string>();
  let m: RegExpExecArray | null;
  const amtRe = /(\d[\d.]*(?:,\d{1,2})?)\s*(milyon|milyar)?\s*(?:₺|TL|Lira)/gi;
  while ((m = amtRe.exec(text))) amounts.add(`${m[1]}${m[2] ? ` ${m[2]}` : ""} ₺`);

  const percents = new Set<string>();
  const pctRe = /(?:%|yüzde)\s*(\d{1,2}(?:[.,]\d{1,2})?)/gi;
  while ((m = pctRe.exec(text))) percents.add(`%${m[1]}`);

  const months = "Ocak|Şubat|Mart|Nisan|Mayıs|Haziran|Temmuz|Ağustos|Eylül|Ekim|Kasım|Aralık";
  const dates = new Set<string>();
  const dateRe = new RegExp(`(\\d{1,2}\\s?${months}\\s?\\d{4})`, "g");
  while ((m = dateRe.exec(text))) dates.add(m[1]);

  const years = new Set<string>();
  const yearRe = /\b(202[4-9])\b/g;
  while ((m = yearRe.exec(text))) years.add(m[1]);

  const orgs = ORGS.filter((o) => text.toLowerCase().includes(o.toLowerCase()));
  return {
    amounts: [...amounts].slice(0, 3),
    percents: [...percents].slice(0, 3),
    dates: [...dates].slice(0, 2),
    years: [...years].slice(0, 2),
    orgs: orgs.slice(0, 3),
  };
}

async function fetchText(url: string, timeoutMs = 9000): Promise<string> {
  const res = await fetch(url, {
    signal: AbortSignal.timeout(timeoutMs),
    headers: { "user-agent": "Mozilla/5.0 (X11; Linux x86_64) App/1.0" },
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.text();
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const settled = await Promise.allSettled(
      DORKS.map(async (d) => {
        const xml = await fetchText(
          `https://news.google.com/rss/search?q=${encodeURIComponent(d.query)}&hl=tr&gl=TR&ceid=TR:tr`
        );
        return parseRss(xml, "Ajans").map((it) => ({ ...it, dorkTopic: d.topic }));
      })
    );

    const raw = settled.flatMap((s) =>
      s.status === "fulfilled" ? s.value : []
    );

    const seen = new Set<string>();
    const byTopic: Record<string, DorkResult[]> = {
      destek: [], fiyat: [], iklim: [], hibe: [],
    };

    for (const it of raw) {
      const key = it.title.toLowerCase().replace(/\s+/g, " ").slice(0, 70);
      if (seen.has(key)) continue;
      seen.add(key);

      const intel = extractIntelligence(it.title);
      let score = intel.amounts.length * 3 + intel.orgs.length * 2 +
        intel.years.length * 2 + intel.dates.length * 2 + intel.percents.length;
      for (const k of KEYWORDS) {
        if (it.title.toLowerCase().includes(k)) score += 1;
      }

      byTopic[it.dorkTopic].push({
        title: it.title,
        link: it.link,
        source: it.source,
        pubDate: it.pubDate,
        topic: it.dorkTopic,
        ...intel,
        score,
      });
    }

    Object.values(byTopic).forEach((arr) =>
      arr.sort((a, b) =>
        b.score - a.score || +new Date(b.pubDate) - +new Date(a.pubDate)
      )
    );

    const allItems = Object.values(byTopic).flat().slice(0, 30);

    const inserts = allItems.map((item) => ({
      title: item.title,
      link: item.link,
      source: item.source,
      pub_date: item.pubDate ? new Date(item.pubDate).toISOString() : null,
      topic: item.topic,
      intelligence: {
        amounts: item.amounts,
        percents: item.percents,
        dates: item.dates,
        years: item.years,
        orgs: item.orgs,
      },
      score: item.score,
    }));

    if (inserts.length > 0) {
      await supabase
        .from("agri_news")
        .upsert(inserts, { onConflict: "title", ignoreDuplicates: true });
    }

    return new Response(
      JSON.stringify({
        success: true,
        live: true,
        itemsCollected: seen.size,
        groups: Object.entries(byTopic).map(([topic, items]) => ({
          topic,
          items: items.slice(0, 5).map((i) => ({
            title: i.title,
            link: i.link,
            source: i.source,
            pubDate: i.pubDate,
            amounts: i.amounts,
            percents: i.percents,
            orgs: i.orgs,
          })),
        })),
        updated: new Date().toISOString(),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, live: false, error: err.message }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
