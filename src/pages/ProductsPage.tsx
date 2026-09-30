import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { ProductWithLatest, Category } from '@/lib/types';
import { formatPrice, formatPercent } from '@/lib/format';
import { Search, TrendingUp, TrendingDown, Filter } from 'lucide-react';

export function ProductsPage() {
  const [products, setProducts] = useState<ProductWithLatest[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');

  useEffect(() => {
    async function fetchData() {
      const [{ data: cats }, { data: prods }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('products').select('*, category:categories(*)').order('name'),
      ]);

      setCategories(cats || []);
      setProducts(prods as ProductWithLatest[] || []);

      if (prods && prods.length > 0) {
        const productIds = prods.map((p) => p.id);
        const { data: prices } = await supabase
          .from('price_data')
          .select('*')
          .in('product_id', productIds)
          .order('date', { ascending: false });

        if (prices) {
          const latestByProduct: Record<string, typeof prices[number]> = {};
          for (const p of prices) {
            if (!latestByProduct[p.product_id]) latestByProduct[p.product_id] = p;
          }
          setProducts(
            (prods as ProductWithLatest[]).map((p) => ({
              ...p,
              latest_price: latestByProduct[p.id] || undefined,
            }))
          );
        }
      }

      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.bourse_name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = activeCategory === 'all' || p.category_id === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, activeCategory]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Ürünler</h1>
        <p className="text-stone-500 mt-1">{products.length} ürün listeleniyor</p>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Ürün veya borsa adı ara..."
          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
        />
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        <Filter className="w-4 h-4 text-stone-400 flex-shrink-0" />
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
            activeCategory === 'all'
              ? 'bg-green-700 text-white'
              : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
          }`}
        >
          Tümü
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCategory(c.id)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeCategory === c.id
                ? 'bg-green-700 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Products grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((p) => {
          const change = p.latest_price?.change_pct ?? 0;
          const isPositive = change >= 0;
          return (
            <Link
              key={p.id}
              to={`/app/products/${p.slug}`}
              className="bg-white rounded-xl border border-stone-200 p-4 hover:border-green-300 hover:shadow-md transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="font-semibold text-stone-800">{p.name}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{p.category?.name}</div>
                </div>
                <div
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium ${
                    isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3" />
                  ) : (
                    <TrendingDown className="w-3 h-3" />
                  )}
                  {formatPercent(change)}
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div className="text-lg font-bold text-stone-800">
                  {p.latest_price ? formatPrice(p.latest_price.price, p.unit) : '-'}
                </div>
                <div className="text-xs text-stone-400">{p.bourse_name}</div>
              </div>
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-stone-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Aramanızla eşleşen ürün bulunamadı</p>
        </div>
      )}
    </div>
  );
}
