import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

interface TobbProduct {
  name: string;
  unit: string;
  date: string;
  minPrice: number;
  maxPrice: number;
  avgPrice: number;
}

interface DbProduct {
  id: string;
  name: string;
  slug: string;
  bourse_code: string;
  bourse_name: string;
  unit: string;
}

function parseTurkishNumber(str: string): number {
  const cleaned = str
    .trim()
    .replace(/[^0-9.,-]/g, "")
    .replace(/\./g, "")
    .replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

function parseDate(dateStr: string): string {
  const match = dateStr.trim().match(/(\d{2})\.(\d{2})\.(\d{4})/);
  if (!match) return new Date().toISOString().split("T")[0];
  return `${match[3]}-${match[2]}-${match[1]}`;
}

function stripBourseSuffix(name: string): string {
  return name.replace(/\s*\([^)]*\)\s*$/, "").trim();
}

function normalizeTr(str: string): string {
  return str
    .toLocaleLowerCase("tr-TR")
    .replace(/İ/g, "i")
    .replace(/I/g, "ı")
    .toLocaleLowerCase("tr-TR");
}

function matchProduct(dbProduct: DbProduct, tobbProducts: TobbProduct[]): TobbProduct | null {
  const baseName = stripBourseSuffix(dbProduct.name);
  const normalizedBase = normalizeTr(baseName);

  let best: TobbProduct | null = null;
  let bestScore = 0;

  for (const tp of tobbProducts) {
    const normalizedTobb = normalizeTr(tp.name);
    let score = 0;

    if (normalizedTobb === normalizedBase) {
      score = 100;
    } else if (normalizedTobb.startsWith(normalizedBase + " ")) {
      score = 80;
    } else if (normalizedBase.startsWith(normalizedTobb + " ")) {
      score = 75;
    } else if (normalizedTobb.includes(normalizedBase) || normalizedBase.includes(normalizedTobb)) {
      score = 60;
    } else {
      const baseWords = normalizedBase.split(/\s+/).filter((w) => w.length >= 3);
      const tobbWords = normalizedTobb.split(/\s+/);
      let matchCount = 0;
      for (const bw of baseWords) {
        if (tobbWords.some((tw) => tw.includes(bw) || bw.includes(tw))) {
          matchCount++;
        }
      }
      if (matchCount > 0 && baseWords.length > 0) {
        score = (matchCount / baseWords.length) * 40;
      }
    }

    if (score > bestScore) {
      bestScore = score;
      best = tp;
    }
  }

  return bestScore >= 50 ? best : null;
}

function extractFromFontTags(html: string): TobbProduct[] {
  const products: TobbProduct[] = [];

  const fontRegex = /<font\s+size=['"]-2['"]>([^<]*)<\/font>/g;
  const cells: string[] = [];
  let match;
  while ((match = fontRegex.exec(html)) !== null) {
    cells.push(match[1].trim());
  }

  for (let i = 0; i < cells.length; i += 9) {
    if (i + 5 >= cells.length) break;

    const name = cells[i];
    const unit = cells[i + 1];
    const dateStr = cells[i + 2];
    const minStr = cells[i + 3];
    const maxStr = cells[i + 4];
    const avgStr = cells[i + 5];

    if (!name || !dateStr || !dateStr.match(/\d{2}\.\d{2}\.\d{4}/)) continue;

    const avgPrice = parseTurkishNumber(avgStr);
    if (avgPrice <= 0) continue;

    const minPrice = parseTurkishNumber(minStr);
    const maxPrice = parseTurkishNumber(maxStr);

    if (minPrice > 0 && maxPrice > 0 && (avgPrice < minPrice * 0.5 || avgPrice > maxPrice * 2)) {
      continue;
    }

    products.push({
      name,
      unit: unit || "KG",
      date: parseDate(dateStr),
      minPrice,
      maxPrice,
      avgPrice,
    });
  }

  return products;
}

function extractFromTable(html: string): TobbProduct[] {
  const products: TobbProduct[] = [];

  const rowRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
  const cellRegex = /<t[d][^>]*>([\s\S]*?)<\/t[d]>/gi;
  let rowMatch;

  while ((rowMatch = rowRegex.exec(html)) !== null) {
    const rowHtml = rowMatch[1];
    const cells: string[] = [];
    let cellMatch;
    while ((cellMatch = cellRegex.exec(rowHtml)) !== null) {
      const text = cellMatch[1]
        .replace(/<[^>]+>/g, "")
        .replace(/&nbsp;/g, " ")
        .replace(/&amp;/g, "&")
        .trim();
      cells.push(text);
    }

    if (cells.length < 6) continue;

    let name = cells[0];
    if (!name || name.length < 2) continue;

    let dateStr = "";
    let minStr = "";
    let maxStr = "";
    let avgStr = "";
    let unit = "";

    for (let i = 1; i < cells.length; i++) {
      if (cells[i].match(/\d{2}\.\d{2}\.\d{4}/)) {
        dateStr = cells[i];
        const remaining = cells.slice(i + 1);
        if (remaining.length >= 3) {
          minStr = remaining[0];
          maxStr = remaining[1];
          avgStr = remaining[2];
        }
        break;
      }
    }

    for (let i = 1; i < cells.length; i++) {
      const c = cells[i].toUpperCase();
      if (c === "KG" || c === "LT" || c === "LİTRE" || c === "LITRE" || c === "ADET" || c === "TON") {
        unit = cells[i];
        break;
      }
    }

    if (!dateStr || !dateStr.match(/\d{2}\.\d{2}\.\d{4}/)) continue;

    const avgPrice = parseTurkishNumber(avgStr);
    if (avgPrice <= 0) continue;

    const minPrice = parseTurkishNumber(minStr);
    const maxPrice = parseTurkishNumber(maxStr);

    if (minPrice > 0 && maxPrice > 0 && (avgPrice < minPrice * 0.5 || avgPrice > maxPrice * 2)) {
      continue;
    }

    products.push({
      name,
      unit: unit || "KG",
      date: parseDate(dateStr),
      minPrice,
      maxPrice,
      avgPrice,
    });
  }

  return products;
}

async function fetchBoursePage(bourseCode: string): Promise<TobbProduct[]> {
  const url = `https://borsa.tobb.org.tr/fiyat_borsa.php?borsakod=${bourseCode}`;
  const resp = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      "Accept-Language": "tr-TR,tr;q=0.9,en;q=0.8",
    },
  });

  if (!resp.ok) {
    throw new Error(`HTTP ${resp.status} for bourse ${bourseCode}`);
  }

  const html = await resp.text();

  let products = extractFromFontTags(html);

  if (products.length === 0) {
    products = extractFromTable(html);
  }

  const seen = new Set<string>();
  return products.filter((p) => {
    const key = `${p.name}_${p.date}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
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

    const { data: products, error: dbError } = await supabase
      .from("products")
      .select("id, name, slug, bourse_code, bourse_name, unit")
      .not("bourse_code", "is", null);

    if (dbError) throw dbError;
    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ message: "Veritabanında ürün bulunamadı", updated: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const byBourse: Record<string, DbProduct[]> = {};
    for (const p of products as DbProduct[]) {
      if (!byBourse[p.bourse_code]) byBourse[p.bourse_code] = [];
      byBourse[p.bourse_code].push(p);
    }

    let totalUpdated = 0;
    let totalMatched = 0;
    let totalSkipped = 0;
    let totalBourses = 0;
    let boursesWithData = 0;
    const errors: string[] = [];
    const today = new Date().toISOString().split("T")[0];

    const bourseCodes = Object.keys(byBourse);

    for (const bourseCode of bourseCodes) {
      totalBourses++;
      try {
        const tobbProducts = await fetchBoursePage(bourseCode);

        if (tobbProducts.length === 0) {
          continue;
        }
        boursesWithData++;

        const dbProducts = byBourse[bourseCode];
        const priceInserts: Array<{
          product_id: string;
          price: number;
          date: string;
          change_pct: number;
          source: string;
        }> = [];
        const matchedProductIds: string[] = [];

        for (const dbProduct of dbProducts) {
          const matched = matchProduct(dbProduct, tobbProducts);
          if (matched) {
            const { data: existingPrices } = await supabase
              .from("price_data")
              .select("price, date")
              .eq("product_id", dbProduct.id)
              .lt("date", matched.date)
              .order("date", { ascending: false })
              .limit(1);

            const prevPrice = existingPrices && existingPrices.length > 0
              ? Number(existingPrices[0].price)
              : 0;

            let changePct = 0;
            if (prevPrice > 0) {
              changePct = Number(
                ((matched.avgPrice - prevPrice) / prevPrice * 100).toFixed(2)
              );
            }

            if (prevPrice > 0) {
              const ratio = matched.avgPrice / prevPrice;
              if (ratio > 3 || ratio < 0.33) {
                totalSkipped++;
                errors.push(
                  `${bourseCode}/${dbProduct.name}: fiyat sapması (önceki: ${prevPrice}, yeni: ${matched.avgPrice})`
                );
                continue;
              }
            }

            totalMatched++;
            matchedProductIds.push(dbProduct.id);

            priceInserts.push({
              product_id: dbProduct.id,
              price: matched.avgPrice,
              date: matched.date,
              change_pct: changePct,
              source: "tobb",
            });
          }
        }

        if (priceInserts.length > 0) {
          const { error: insertError } = await supabase
            .from("price_data")
            .upsert(priceInserts, { onConflict: "product_id,date" });

          if (insertError) {
            errors.push(`${bourseCode}: ${insertError.message}`);
          } else {
            totalUpdated += priceInserts.length;
          }

          const { error: updateError } = await supabase
            .from("products")
            .update({ last_scraped_at: new Date().toISOString() })
            .in("id", matchedProductIds);

          if (updateError) {
            errors.push(`${bourseCode} update: ${updateError.message}`);
          }
        }
      } catch (err) {
        errors.push(`${bourseCode}: ${err.message}`);
      }
    }

    return new Response(
      JSON.stringify({
        message: "TOBB fiyat verisi güncellendi",
        updated: totalUpdated,
        matched: totalMatched,
        skipped: totalSkipped,
        total_products: products.length,
        total_bourses: totalBourses,
        bourses_with_data: boursesWithData,
        date: today,
        errors: errors.slice(0, 20),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
