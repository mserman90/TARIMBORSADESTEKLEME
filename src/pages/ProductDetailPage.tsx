import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Product, PriceData, Category } from '@/lib/types';
import { formatPrice, formatPercent, formatDate, formatDateShort } from '@/lib/format';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';
import { ArrowLeft, TrendingUp, TrendingDown, Calendar, MapPin } from 'lucide-react';

type RangeKey = '7d' | '14d' | '30d';

const RANGES: { key: RangeKey; label: string; days: number }[] = [
  { key: '7d', label: '7 Gün', days: 7 },
  { key: '14d', label: '14 Gün', days: 14 },
  { key: '30d', label: '30 Gün', days: 30 },
];

export function ProductDetailPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product & { category?: Category } | null>(null);
  const [prices, setPrices] = useState<PriceData[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<RangeKey>('30d');

  useEffect(() => {
    async function fetchData() {
      const { data: prod } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .eq('slug', slug)
        .maybeSingle();

      if (!prod) {
        setLoading(false);
        return;
      }

      setProduct(prod as Product & { category?: Category });

      const { data: priceData } = await supabase
        .from('price_data')
        .select('*')
        .eq('product_id', prod.id)
        .order('date', { ascending: true });

      setPrices(priceData || []);
      setLoading(false);
    }
    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-8 text-center">
        <p className="text-stone-500 mb-4">Ürün bulunamadı</p>
        <Link to="/app/products" className="text-green-700 hover:underline">
          Ürünlere dön
        </Link>
      </div>
    );
  }

  const rangeDays = RANGES.find((r) => r.key === range)!.days;
  const filteredPrices = prices.slice(-rangeDays);
  const latest = prices[prices.length - 1];
  const previous = prices[prices.length - 2];
  const change = latest?.change_pct ?? 0;
  const isPositive = change >= 0;

  // Calculate stats
  const rangePrices = filteredPrices.map((p) => p.price);
  const minPrice = rangePrices.length ? Math.min(...rangePrices) : 0;
  const maxPrice = rangePrices.length ? Math.max(...rangePrices) : 0;
  const avgPrice = rangePrices.length
    ? rangePrices.reduce((a, b) => a + b, 0) / rangePrices.length
    : 0;

  const chartData = filteredPrices.map((p) => ({
    date: p.date,
    price: p.price,
  }));

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <Link
        to="/app/products"
        className="inline-flex items-center gap-1.5 text-sm text-stone-500 hover:text-stone-800 mb-4"
      >
        <ArrowLeft className="w-4 h-4" />
        Ürünlere dön
      </Link>

      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 mb-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-stone-800">{product.name}</h1>
            <div className="flex items-center gap-4 mt-2 text-sm text-stone-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                {product.category?.name}
              </span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {product.bourse_name}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-stone-800">
              {latest ? formatPrice(latest.price, product.unit) : '-'}
            </div>
            {latest && (
              <div
                className={`flex items-center justify-end gap-1 text-sm font-medium ${
                  isPositive ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {formatPercent(change)}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="text-xs text-stone-500 mb-1">En Düşük</div>
          <div className="font-bold text-stone-800">{formatPrice(minPrice, product.unit)}</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="text-xs text-stone-500 mb-1">Ortalama</div>
          <div className="font-bold text-stone-800">{formatPrice(avgPrice, product.unit)}</div>
        </div>
        <div className="bg-white rounded-xl border border-stone-200 p-4">
          <div className="text-xs text-stone-500 mb-1">En Yüksek</div>
          <div className="font-bold text-stone-800">{formatPrice(maxPrice, product.unit)}</div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-stone-200 p-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-bold text-stone-800">Fiyat Geçmişi</h2>
            <p className="text-sm text-stone-500">{product.name} fiyat değişimi</p>
          </div>
          <div className="flex gap-1 p-1 bg-stone-100 rounded-lg">
            {RANGES.map((r) => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${
                  range === r.key
                    ? 'bg-white text-stone-800 shadow-sm'
                    : 'text-stone-500'
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#16a34a" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#16a34a" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="date"
              tickFormatter={(v) => formatDateShort(v)}
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
              labelFormatter={(v) => formatDate(v as string)}
              formatter={(v) => [formatPrice(Number(v), product.unit), 'Fiyat']}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#16a34a"
              fill="url(#priceGrad)"
              strokeWidth={2.5}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Price history table */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200">
          <h2 className="font-bold text-stone-800 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-stone-400" />
            Geçmiş Fiyatlar
          </h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-stone-50 text-stone-500 text-xs">
                <th className="text-left px-5 py-3 font-medium">Tarih</th>
                <th className="text-right px-5 py-3 font-medium">Fiyat</th>
                <th className="text-right px-5 py-3 font-medium">Değişim</th>
              </tr>
            </thead>
            <tbody>
              {[...filteredPrices].reverse().map((p, i, arr) => {
                const prev = arr[i + 1];
                const pct = prev ? ((p.price - prev.price) / prev.price) * 100 : p.change_pct;
                const positive = pct >= 0;
                return (
                  <tr key={p.id} className="border-t border-stone-100 hover:bg-stone-50">
                    <td className="px-5 py-3 text-stone-700">{formatDate(p.date)}</td>
                    <td className="px-5 py-3 text-right font-medium text-stone-800">
                      {formatPrice(p.price, product.unit)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <span
                        className={`inline-flex items-center gap-1 font-medium ${
                          positive ? 'text-green-600' : 'text-red-600'
                        }`}
                      >
                        {positive ? (
                          <TrendingUp className="w-3 h-3" />
                        ) : (
                          <TrendingDown className="w-3 h-3" />
                        )}
                        {formatPercent(pct)}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
