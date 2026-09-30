import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ProductWithLatest, PriceData } from '@/lib/types';
import { formatPriceShort, formatPercent } from '@/lib/format';
import { TrendingUp, TrendingDown } from 'lucide-react';

export function PriceTicker({ variant = 'app' }: { variant?: 'app' | 'landing' }) {
  const [products, setProducts] = useState<ProductWithLatest[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchPrices() {
      const { data: prods } = await supabase
        .from('products')
        .select('*, category:categories(*)')
        .order('name');

      if (!prods || prods.length === 0) {
        setLoading(false);
        return;
      }

      const productIds = prods.map((p) => p.id);
      const { data: prices } = await supabase
        .from('price_data')
        .select('*')
        .in('product_id', productIds)
        .order('date', { ascending: false });

      const latestByProduct: Record<string, PriceData> = {};
      if (prices) {
        for (const p of prices) {
          if (!latestByProduct[p.product_id]) latestByProduct[p.product_id] = p;
        }
      }

      const enriched = (prods as ProductWithLatest[])
        .map((p) => ({
          ...p,
          latest_price: latestByProduct[p.id] || undefined,
        }))
        .filter((p) => p.latest_price);

      setProducts(enriched);
      setLoading(false);
    }
    fetchPrices();
  }, []);

  if (loading || products.length === 0) return null;

  const tickerItems = [...products, ...products];

  const isLanding = variant === 'landing';

  return (
    <div
      className={`relative overflow-hidden ${
        isLanding
          ? 'bg-stone-900 text-white'
          : 'bg-stone-900 text-white'
      }`}
    >
      <div className="flex items-stretch">
        {/* Label */}
        <div className="flex items-center gap-2 px-4 py-2.5 bg-green-700 text-white font-bold text-sm whitespace-nowrap flex-shrink-0 z-10">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-300 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-300"></span>
          </span>
          CANLI FİYATLAR
        </div>

        {/* Scrolling content */}
        <div
          ref={scrollRef}
          className="flex items-center gap-6 py-2.5 overflow-hidden whitespace-nowrap"
          style={{
            animation: 'tickerScroll 60s linear infinite',
          }}
        >
          {tickerItems.map((p, idx) => {
            const change = p.latest_price?.change_pct ?? 0;
            const isPositive = change >= 0;
            return (
              <Link
                key={`${p.id}-${idx}`}
                to={`/app/products/${p.slug}`}
                className="inline-flex items-center gap-2 text-sm hover:text-green-300 transition-colors"
              >
                <span className="font-medium text-stone-200">{p.name}</span>
                <span className="font-bold text-white">
                  {formatPriceShort(p.latest_price!.price)} ₺
                </span>
                <span
                  className={`inline-flex items-center gap-0.5 text-xs font-medium ${
                    isPositive ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {formatPercent(change)}
                </span>
                <span className="text-stone-600 ml-2">|</span>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
