import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Get all active subscriptions with category and user info
    const { data: subscriptions, error: subError } = await supabase
      .from("subscriptions")
      .select("id, user_id, category_id, frequency")
      .eq("is_active", true);

    if (subError) throw subError;
    if (!subscriptions || subscriptions.length === 0) {
      return new Response(
        JSON.stringify({ message: "Aktif abonelik bulunamadı", sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get categories
    const categoryIds = [...new Set(subscriptions.map((s) => s.category_id))];
    const { data: categories } = await supabase
      .from("categories")
      .select("id, name")
      .in("id", categoryIds);

    // Get products for these categories
    const { data: products } = await supabase
      .from("products")
      .select("id, name, slug, unit, bourse_name, category_id")
      .in("category_id", categoryIds);

    if (!products || products.length === 0) {
      return new Response(
        JSON.stringify({ message: "Ürün bulunamadı", sent: 0 }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Get latest prices for all products
    const productIds = products.map((p) => p.id);
    const { data: prices } = await supabase
      .from("price_data")
      .select("product_id, price, date, change_pct")
      .in("product_id", productIds)
      .order("date", { ascending: false });

    // Group latest price per product
    const latestByProduct: Record<string, { price: number; date: string; change_pct: number }> = {};
    if (prices) {
      for (const p of prices) {
        if (!latestByProduct[p.product_id]) {
          latestByProduct[p.product_id] = { price: p.price, date: p.date, change_pct: p.change_pct };
        }
      }
    }

    // Get user emails from auth
    const userIds = [...new Set(subscriptions.map((s) => s.user_id))];
    const { data: users } = await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 1000,
    });
    const userEmailMap: Record<string, string> = {};
    if (users?.users) {
      for (const u of users.users) {
        if (userIds.includes(u.id)) {
          userEmailMap[u.id] = u.email || "";
        }
      }
    }

    // Group subscriptions by user
    const subsByUser: Record<string, typeof subscriptions> = {};
    for (const sub of subscriptions) {
      if (!subsByUser[sub.user_id]) subsByUser[sub.user_id] = [];
      subsByUser[sub.user_id].push(sub);
    }

    let sentCount = 0;
    const today = new Date().toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });

    // For each user, compose and "send" email, log it
    for (const [userId, userSubs] of Object.entries(subsByUser)) {
      const email = userEmailMap[userId];
      if (!email) continue;

      const userCategoryIds = userSubs.map((s) => s.category_id);
      const userCategories = (categories || []).filter((c) => userCategoryIds.includes(c.id));
      const userProducts = products.filter((p) => userCategoryIds.includes(p.category_id));

      // Build price summary
      const priceLines: string[] = [];
      for (const p of userProducts) {
        const latest = latestByProduct[p.id];
        if (!latest) continue;
        const changeStr = latest.change_pct >= 0
          ? `+${latest.change_pct.toFixed(2)}% ↑`
          : `${latest.change_pct.toFixed(2)}% ↓`;
        priceLines.push(
          `${p.name}: ${latest.price.toFixed(2)} ₺/${p.unit} (${changeStr}) - ${p.bourse_name}`
        );
      }

      if (priceLines.length === 0) continue;

      const categoryNames = userCategories.map((c) => c.name).join(", ");
      const subject = `TarımBorsa - ${today} Fiyat Özeti`;
      const content = [
        `Merhaba,`,
        ``,
        `${today} tarihli ${categoryNames} fiyat özeti:`,
        ``,
        ...priceLines,
        ``,
        `Aboneliklerinizi yönetmek için: https://tarimborsa.app/app/settings`,
      ].join("\n");

      // Log the notification
      const { error: logError } = await supabase.from("notification_logs").insert({
        user_id: userId,
        subject,
        content,
        status: "sent",
      });

      if (!logError) sentCount++;
    }

    return new Response(
      JSON.stringify({
        message: `${sentCount} kullanıcıya bildirim gönderildi`,
        sent: sentCount,
        total_subscriptions: subscriptions.length,
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
