import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ProductWithLatest, Category, AgriSupport } from '@/lib/types';
import { formatPrice, formatPercent, formatDate } from '@/lib/format';
import {
  TrendingUp,
  TrendingDown,
  Package,
  ArrowRight,
  Activity,
  BarChart3,
  Landmark,
  CheckCircle2,
  Clock,
  XCircle,
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';

export function DashboardPage() {
  const [products, setProducts] = useState<ProductWithLatest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [chartData, setChartData] = useState<{ date: string; [key: string]: number | string }[]>([]);
  const [supports, setSupports] = useState<AgriSupport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*, category:categories(*)').order('name'),
      ]);

      setCategories(cats || []);
      setProducts(prods as ProductWithLatest[] || []);

      const { data: supData } = await supabase
        .from('agri_supports')
        .select('*')
        .order('sort_order', { ascending: true })
          .limit(4);
      if (supData) setSupports(supData as AgriSupport[]);

      // Get latest prices for all products
      if (prods && prods.length > 0) {
        const productIds = prods.map((p) => p.id);
        const { data: prices } = await supabase
          .from('price_data')
          .select('*')
          .in('product_id', productIds)
          .order('date', { ascending: false })
          .limit(productIds.length * 30);

        if (prices) {
          // Group by product to find latest and previous
          const pricesByProduct: Record<string, typeof prices> = {};
          for (const p of prices) {
            if (!pricesByProduct[p.product_id]) pricesByProduct[p.product_id] = [];
            pricesByProduct[p.product_id].push(p);
          }

          const enriched = (prods as ProductWithLatest[]).map((p) => {
            const pPrices = pricesByProduct[p.id] || [];
            return {
              ...p,
              latest_price: pPrices[0] || undefined,
              previous_price: pPrices[1] || undefined,
            };
          });
          setProducts(enriched);

          // Build chart data from top 5 products (by price count)
          const top5 = enriched.slice(0, 5);
          const dateMap: Record<string, { date: string; [key: string]: number | string }> = {};

          for (const p of top5) {
            const pPrices = (pricesByProduct[p.id] || []).slice(0, 30).reverse();
            for (const pr of pPrices) {
              if (!dateMap[pr.date]) dateMap[pr.date] = { date: pr.date };
              dateMap[pr.date][p.name] = pr.price;
            }
          }

          setChartData(Object.values(dateMap).sort((a, b) => a.date.localeCompare(b.date)));
        }
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
      </div>
    );
  }

  const gainers = products.filter(
    (p) => p.latest_price && p.latest_price.change_pct > 0
  );
  const losers = products.filter(
    (p) => p.latest_price && p.latest_price.change_pct < 0
  );

  const colors = ['#16a34a', '#0891b2', '#ca8a04', '#dc2626', '#7c3aed'];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-stone-800">Fiyat Paneli</h1>
        <p className="text-stone-500 mt-1">
          {formatDate(new Date().toISOString())} güncel fiyat verileri
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
            <Package className="w-4 h-4" />
            Takip edilen ürün
          </div>
          <div className="text-2xl font-bold text-stone-800">{products.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
            <BarChart3 className="w-4 h-4" />
            Kategori
          </div>
          <div className="text-2xl font-bold text-stone-800">{categories.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
            <TrendingUp className="w-4 h-4 text-green-600" />
            Yükselen
          </div>
          <div className="text-2xl font-bold text-green-700">{gainers.length}</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="flex items-center gap-2 text-stone-500 text-sm mb-1">
            <TrendingDown className="w-4 h-4 text-red-600" />
            Düşen
          </div>
          <div className="text-2xl font-bold text-red-700">{losers.length}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-xl border border-stone-200 p-5 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-stone-800">Fiyat Trendleri</h2>
            <p className="text-sm text-stone-500">Son 30 gün - ilk 5 ürün</p>
          </div>
          <Activity className="w-5 h-5 text-stone-400" />
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={chartData}>
            <defs>
              {colors.map((c, i) => (
                <linearGradient key={i} id={`grad${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={c} stopOpacity={0.15} />
                  <stop offset="95%" stopColor={c} stopOpacity={0} />
                </linearGradient>
              ))}
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => new Date(v).toLocaleDateString('tr-TR', { day: '2-digit', month: '2-digit' })}
              tick={{ fontSize: 11, fill: '#78716c' }}
              stroke="#d6d3d1"
            />
            <YAxis tick={{ fontSize: 11, fill: '#78716c' }} stroke="#d6d3d1" />
            <Tooltip
              contentStyle={{
                borderRadius: '12px',
                border: '1px solid #e7e5e4',
                fontSize: '12px',
              }}
              labelFormatter={(v) => new Date(String(v)).toLocaleDateString('tr-TR')}
            />
            {products.slice(0, 5).map((p, i) => (
              <Area
                key={p.id}
                type="monotone"
                dataKey={p.name}
                stroke={colors[i]}
                fill={`url(#grad${i})`}
                strokeWidth={2}
                connectNulls
              />
            ))}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Top Movers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div>
          <h2 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            En Çok Yükselenler
          </h2>
          <div className="space-y-2">
            {gainers
              .sort((a, b) => (b.latest_price?.change_pct ?? 0) - (a.latest_price?.change_pct ?? 0))
              .slice(0, 5)
              .map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            {gainers.length === 0 && (
              <p className="text-sm text-stone-400 py-4 text-center">Yükselen fiyat yok</p>
            )}
          </div>
        </div>
        <div>
          <h2 className="font-bold text-stone-800 mb-3 flex items-center gap-2">
            <TrendingDown className="w-5 h-5 text-red-600" />
            En Çok Düşenler
          </h2>
          <div className="space-y-2">
            {losers
              .sort((a, b) => (a.latest_price?.change_pct ?? 0) - (b.latest_price?.change_pct ?? 0))
              .slice(0, 5)
              .map((p) => (
                <ProductRow key={p.id} product={p} />
              ))}
            {losers.length === 0 && (
              <p className="text-sm text-stone-400 py-4 text-center">Düşen fiyat yok</p>
            )}
          </div>
        </div>
      </div>

      {/* Agricultural supports preview */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-stone-800 flex items-center gap-2">
            <Landmark className="w-5 h-5 text-green-600" />
            Tarımsal Destekler
          </h2>
          <Link
            to="/app/supports"
            className="text-sm text-green-700 font-medium hover:underline flex items-center gap-1"
          >
            Tümünü Gör
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {supports.map((s) => {
            const StatusIcon = s.status === 'active' ? CheckCircle2 : s.status === 'upcoming' ? Clock : XCircle;
            const statusColor = s.status === 'active' ? 'text-green-600' : s.status === 'upcoming' ? 'text-amber-600' : 'text-stone-400';
            const statusLabel = s.status === 'active' ? 'Aktif' : s.status === 'upcoming' ? 'Yaklaşan' : 'Kapandı';
            return (
              <Link
                key={s.id}
                to="/app/supports"
                className="bg-white rounded-xl border border-stone-200 p-4 hover:border-green-300 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-1.5 mb-2">
                  <StatusIcon className={`w-3.5 h-3.5 ${statusColor}`} />
                  <span className={`text-xs font-medium ${statusColor}`}>{statusLabel}</span>
                </div>
                <div className="font-medium text-stone-800 text-sm mb-1">{s.title}</div>
                <div className="text-xs text-stone-500 mb-2">{s.agency}</div>
                <div className="text-xs font-medium text-green-700">{s.amount_text}</div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* All products quick list */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-stone-800">Tüm Ürünler</h2>
          <Link
            to="/app/products"
            className="text-sm text-green-700 font-medium hover:underline flex items-center gap-1"
          >
            Tümünü Gör
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {products.map((p) => (
            <Link
              key={p.id}
              to={`/app/products/${p.slug}`}
              className="bg-white rounded-xl border border-stone-200 p-4 hover:border-green-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-stone-800">{p.name}</div>
                  <div className="text-xs text-stone-500">{p.category?.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-stone-800">
                    {p.latest_price ? formatPrice(p.latest_price.price, p.unit) : '-'}
                  </div>
                  {p.latest_price && (
                    <div
                      className={`text-xs font-medium ${
                        p.latest_price.change_pct >= 0 ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {formatPercent(p.latest_price.change_pct)}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function ProductRow({ product }: { product: ProductWithLatest }) {
  const change = product.latest_price?.change_pct ?? 0;
  const isPositive = change >= 0;

  return (
    <Link
      to={`/app/products/${product.slug}`}
      className="flex items-center justify-between bg-white rounded-lg border border-stone-200 p-3 hover:border-stone-300 transition-all"
    >
      <div className="flex items-center gap-3">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
            isPositive ? 'bg-green-50' : 'bg-red-50'
          }`}
        >
          {isPositive ? (
            <TrendingUp className="w-4 h-4 text-green-600" />
          ) : (
            <TrendingDown className="w-4 h-4 text-red-600" />
          )}
        </div>
        <div>
          <div className="font-medium text-stone-800 text-sm">{product.name}</div>
          <div className="text-xs text-stone-500">{product.bourse_name}</div>
        </div>
      </div>
      <div className="text-right">
        <div className="font-semibold text-stone-800 text-sm">
          {product.latest_price ? formatPrice(product.latest_price.price, product.unit) : '-'}
        </div>
        <div className={`text-xs font-medium ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {formatPercent(change)}
        </div>
      </div>
    </Link>
  );
}
