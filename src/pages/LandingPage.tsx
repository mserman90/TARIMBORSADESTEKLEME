import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import {
  Sprout,
  Mail,
  Search,
  TrendingUp,
  TrendingDown,
  Filter,
  Landmark,
  Calendar,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  CalendarPlus,
  Download,
  Package,
  ArrowRight,
} from 'lucide-react';
import { PriceTicker } from '@/components/PriceTicker';
import { SupportCalendar } from '@/components/SupportCalendar';
import { ProductWithLatest, Category, AgriSupport, STATUS_LABELS, STATUS_COLORS } from '@/lib/types';
import { formatPrice, formatPercent } from '@/lib/format';
import { downloadICS, getGoogleCalendarUrl, parseTurkishDate } from '@/lib/ics';

type Tab = 'prices' | 'supports';

export function LandingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('prices');

  return (
    <div className="min-h-screen bg-stone-50">
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-stone-800 text-lg">TarımBorsa</span>
            </div>

            <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-lg">
              <button
                onClick={() => setActiveTab('prices')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'prices'
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Fiyatlar</span>
              </button>
              <button
                onClick={() => setActiveTab('supports')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${
                  activeTab === 'supports'
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-stone-500 hover:text-stone-700'
                }`}
              >
                <Sprout className="w-4 h-4" />
                <span className="hidden sm:inline">Tarımsal Destekler</span>
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/auth"
              className="hidden sm:inline-flex px-4 py-2 text-sm font-medium text-stone-700 hover:text-green-700 transition-colors whitespace-nowrap"
            >
              Giriş Yap
            </Link>
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-green-700 text-white text-sm font-medium hover:bg-green-800 transition-colors"
            >
              Ücretsiz Başla
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <PriceTicker variant="landing" />

      <main className="px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'prices' ? <PricesContent /> : <SupportsContent />}
      </main>

      <footer className="py-8 px-4 text-center text-sm text-stone-500 border-t border-stone-200 mt-12">
        © 2026 TarımBorsa · Türkiye tarım fiyat takip platformu ·{' '}
        <Link to="/auth" className="text-green-700 hover:underline">
          Hesap oluştur
        </Link>
      </footer>
    </div>
  );
}

/* ---------- Prices ---------- */

function PricesContent() {
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
      <div className="flex items-center justify-center py-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((p) => {
          const change = p.latest_price?.change_pct ?? 0;
          const isPositive = change >= 0;
          return (
            <Link
              key={p.id}
              to="/auth"
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
                  {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
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

/* ---------- Supports ---------- */

function SupportsContent() {
  const [supports, setSupports] = useState<AgriSupport[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      const { data, error } = await supabase
        .from('agri_supports')
        .select('*')
        .order('sort_order', { ascending: true });

      if (!error && data) {
        setSupports(data as AgriSupport[]);
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = supports
    .filter((s) => {
      const matchesSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.agency.toLowerCase().includes(search.toLowerCase()) ||
        s.summary.toLowerCase().includes(search.toLowerCase());
      const matchesFilter = activeFilter === 'all' || s.status === activeFilter;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      const statusOrder: Record<string, number> = { active: 0, upcoming: 1, closed: 2 };
      const sa = statusOrder[a.status] ?? 3;
      const sb = statusOrder[b.status] ?? 3;
      if (activeFilter === 'all') {
        if (sa !== sb) return sa - sb;
        return (a.sort_order ?? 0) - (b.sort_order ?? 0);
      }
      return (a.sort_order ?? 0) - (b.sort_order ?? 0);
    });

  const counts = {
    all: supports.length,
    active: supports.filter((s) => s.status === 'active').length,
    upcoming: supports.filter((s) => s.status === 'upcoming').length,
    closed: supports.filter((s) => s.status === 'closed').length,
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-green-700" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Destek adı, kurum veya anahtar kelime ara..."
          className="w-full pl-10 pr-3 py-2.5 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-all"
        />
      </div>

      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {[
          { key: 'all', label: 'Tümü', count: counts.all },
          { key: 'active', label: 'Aktif', count: counts.active },
          { key: 'upcoming', label: 'Yaklaşan', count: counts.upcoming },
          { key: 'closed', label: 'Kapandı', count: counts.closed },
        ].map((f) => (
          <button
            key={f.key}
            onClick={() => setActiveFilter(f.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeFilter === f.key
                ? 'bg-green-700 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            {f.label} ({f.count})
          </button>
        ))}
      </div>

      <div className="mb-6">
        <SupportCalendar supports={supports} />
      </div>

      <div className="space-y-3">
        {filtered.map((s) => {
          const isExpanded = expandedId === s.id;
          const StatusIcon =
            s.status === 'active' ? CheckCircle2 : s.status === 'upcoming' ? Clock : XCircle;
          return (
            <div
              key={s.id}
              className="bg-white rounded-xl border border-stone-200 overflow-hidden hover:border-stone-300 transition-all"
            >
              <button
                onClick={() => setExpandedId(isExpanded ? null : s.id)}
                className="w-full text-left p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${STATUS_COLORS[s.status]}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {STATUS_LABELS[s.status]}
                      </span>
                      {s.featured && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                          Öne Çıkan
                        </span>
                      )}
                    </div>
                    <h3 className="font-bold text-stone-800 mb-1">{s.title}</h3>
                    <p className="text-sm text-stone-600 line-clamp-2">{s.summary}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-stone-500">
                      <span className="flex items-center gap-1">
                        <Landmark className="w-3.5 h-3.5" />
                        {s.agency}
                      </span>
                      <span className="flex items-center gap-1 font-medium text-green-700">
                        {s.amount_text}
                      </span>
                    </div>
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-stone-100 pt-4 space-y-4">
                  {s.description && (
                    <p className="text-sm text-stone-600 leading-relaxed">{s.description}</p>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
                        Başvuru Dönemi
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-stone-700">
                        <Calendar className="w-4 h-4 text-stone-400" />
                        {s.application_start || '-'}
                        {s.application_end && ` — ${s.application_end}`}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
                        Başvuru Yöntemi
                      </h4>
                      <div className="text-sm text-stone-700">
                        {s.application_method || '-'}
                      </div>
                    </div>
                  </div>

                  {s.eligibility && s.eligibility.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
                        Uygunluk Koşulları
                      </h4>
                      <ul className="space-y-1">
                        {s.eligibility.map((e, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                            <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                            {e}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {s.required_documents && s.required_documents.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
                        Gerekli Belgeler
                      </h4>
                      <ul className="space-y-1">
                        {s.required_documents.map((d, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-stone-600">
                            <FileText className="w-4 h-4 text-stone-400 mt-0.5 flex-shrink-0" />
                            {d}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {(() => {
                    const hasDates =
                      parseTurkishDate(s.application_start || '') ||
                      parseTurkishDate(s.application_end || '');
                    const gcalUrl = getGoogleCalendarUrl(s);
                    if (!hasDates) return null;
                    return (
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => downloadICS(s)}
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 px-2.5 py-1.5 rounded-lg border border-green-200 bg-green-50 hover:bg-green-100 transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          .ics indir
                        </button>
                        {gcalUrl && (
                          <a
                            href={gcalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-700 hover:text-blue-800 px-2.5 py-1.5 rounded-lg border border-blue-200 bg-blue-50 hover:bg-blue-100 transition-colors"
                          >
                            <CalendarPlus className="w-3.5 h-3.5" />
                            Google Takvim
                          </a>
                        )}
                      </div>
                    );
                  })()}

                  {s.official_url && (
                    <a
                      href={s.official_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-sm font-medium text-green-700 hover:text-green-800 transition-colors"
                    >
                      Resmî siteye git
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  <div className="text-xs text-stone-400 pt-2 border-t border-stone-100">
                    Son doğrulama: {new Date(s.verified_at).toLocaleDateString('tr-TR', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-stone-400">
          <Search className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Aramanızla eşleşen destek programı bulunamadı</p>
        </div>
      )}
    </div>
  );
}
