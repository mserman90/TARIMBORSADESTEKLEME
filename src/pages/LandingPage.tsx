import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  TrendingUp,
  Mail,
  Shield,
  BarChart3,
  ArrowRight,
  Check,
  Landmark,
  Calendar,
  FileText,
  ExternalLink,
  CheckCircle2,
  Clock,
  XCircle,
  Search,
  Loader2,
} from 'lucide-react';
import { PriceTicker } from '@/components/PriceTicker';
import { supabase } from '@/lib/supabase';
import { AgriSupport, STATUS_LABELS, STATUS_COLORS } from '@/lib/types';

type Tab = 'prices' | 'supports';

export function LandingPage() {
  const [activeTab, setActiveTab] = useState<Tab>('prices');

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-green-600 to-green-800 flex items-center justify-center">
                <Sprout className="w-5 h-5 text-white" strokeWidth={2.5} />
              </div>
              <span className="font-bold text-stone-800 text-lg">TarımBorsa</span>
            </div>

            {/* Tabs */}
            <div className="hidden sm:flex items-center gap-1 ml-2">
              <button
                onClick={() => setActiveTab('prices')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'prices'
                    ? 'bg-green-50 text-green-700'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                Fiyatlar
              </button>
              <button
                onClick={() => setActiveTab('supports')}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === 'supports'
                    ? 'bg-green-50 text-green-700'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                Tarımsal Destekler
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile tab selector */}
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value as Tab)}
              className="sm:hidden px-2 py-1.5 rounded-lg border border-stone-200 text-sm text-stone-700 bg-white"
            >
              <option value="prices">Fiyatlar</option>
              <option value="supports">Tarımsal Destekler</option>
            </select>
            <Link
              to="/auth"
              className="px-4 py-2 text-sm font-medium text-stone-700 hover:text-green-700 transition-colors whitespace-nowrap"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </nav>

      <PriceTicker variant="landing" />

      {activeTab === 'prices' ? <PricesContent /> : <SupportsContent />}
    </div>
  );
}

function PricesContent() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium mb-6">
            <TrendingUp className="w-4 h-4" />
            Türkiye'nin tarım fiyat takip platformu
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-stone-800 leading-tight mb-6">
            Tarım ve hayvancılık
            <br />
            <span className="text-green-700">fiyatlarını takip edin</span>
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Türkiye'deki ticaret borsalarından günlük fiyat verilerini otomatik çekin.
            İlgilendiğiniz kategorilere abone olun, fiyat değişimlerini e-posta ile alın.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-green-700 text-white font-medium hover:bg-green-800 transition-all shadow-lg shadow-green-700/20"
            >
              Ücretsiz Başla
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/app"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-stone-700 font-medium border border-stone-200 hover:border-stone-300 transition-all"
            >
              Demoyu İncele
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: BarChart3,
                title: 'Canlı Fiyat Paneli',
                desc: '22+ ürün için günlük fiyat verileri, değişim yüzdeleri ve interaktif grafikler.',
              },
              {
                icon: Mail,
                title: 'E-posta Bildirimleri',
                desc: 'Günlük, haftalık veya anlık alarm. Fiyat özetleri şık e-posta şablonuyla gelir.',
              },
              {
                icon: Shield,
                title: 'Güvenli & Özel',
                desc: 'Abonelik tercihleriniz sadece size özel. İstediğiniz zaman abonelikten çıkın.',
              },
            ].map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  className="p-6 rounded-2xl border border-stone-200 hover:border-green-300 hover:shadow-lg transition-all"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-50 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-green-700" />
                  </div>
                  <h3 className="font-bold text-stone-800 text-lg mb-2">{f.title}</h3>
                  <p className="text-stone-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-stone-800 text-center mb-4">
            Takip edilebilen kategoriler
          </h2>
          <p className="text-stone-600 text-center mb-12 max-w-2xl mx-auto">
            6 ana kategori, 71 borsa, 145+ ürün. İstediğiniz kategoriye abone olun, sadece ilgilerinizi alın.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { name: 'Tahıllar', items: 'Buğday, Arpa, Mısır, Yulaf, Çavdar' },
              { name: 'Bakliyat', items: 'Nohut, Mercimek, Fasulye, Börülce' },
              { name: 'Yağlı Tohumlar', items: 'Ayçiçeği, Soya, Aspir, Haşhaş' },
              { name: 'Hayvancılık', items: 'Koyun, Kuzu, Dana, Tavuk, Balık' },
              { name: 'Meyve & Sebze', items: 'Soğan, Patates, Domates, Üzüm' },
              { name: 'Diğer', items: 'Pamuk, Fındık, Zeytin, Antep Fıstığı' },
            ].map((c) => (
              <div
                key={c.name}
                className="p-4 rounded-xl bg-white border border-stone-200 hover:border-green-300 transition-all"
              >
                <h4 className="font-semibold text-stone-800 text-sm mb-1">{c.name}</h4>
                <p className="text-xs text-stone-500">{c.items}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-700 to-green-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Bugün başlayın, fiyatları kaçırmayın
          </h2>
          <p className="text-green-100 mb-8">
            Hesabınızı oluşturun, kategorilere abone olun, e-posta bildirimlerinizi alın.
          </p>
          <div className="space-y-3 mb-8 max-w-md mx-auto text-left">
            {['Ücretsiz hesap oluşturun', 'Kategorilere abone olun', 'E-posta bildirimlerini alın'].map(
              (s) => (
                <div key={s} className="flex items-center gap-3 text-white">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Check className="w-4 h-4" />
                  </div>
                  {s}
                </div>
              )
            )}
          </div>
          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-green-800 font-bold hover:bg-green-50 transition-all shadow-lg"
          >
            Hesap Oluştur
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-stone-500">
        © 2026 TarımBorsa. Türkiye tarım fiyat takip platformu.
      </footer>
    </>
  );
}

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

  const filtered = supports.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.agency.toLowerCase().includes(search.toLowerCase()) ||
      s.summary.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = activeFilter === 'all' || s.status === activeFilter;
    return matchesSearch && matchesFilter;
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
    <>
      {/* Hero */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-50 border border-green-200 text-green-700 text-sm font-medium mb-6">
            <Landmark className="w-4 h-4" />
            Resmî Gazete ve Bakanlık duyurularından doğrulanmıştır
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-stone-800 leading-tight mb-6">
            Tarımsal <span className="text-green-700">Destekler</span>
          </h1>
          <p className="text-lg text-stone-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Çiftçilere yönelik güncel destek, hibe ve prim programları. Tutarlar Resmî Gazete
            kararları ve Tarım ve Orman Bakanlığı duyurularından doğrulanmıştır.
          </p>
        </div>
      </section>

      {/* Supports content */}
      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {/* Search */}
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

          {/* Status filter */}
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

          {/* Support cards */}
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

          {/* CTA */}
          <div className="mt-12 text-center p-8 rounded-2xl bg-gradient-to-br from-green-700 to-green-900">
            <h2 className="text-2xl font-bold text-white mb-3">
              Desteklerden haberdar olun
            </h2>
            <p className="text-green-100 mb-6 max-w-xl mx-auto">
              Hesap oluşturun, destek ve fiyat bildirimlerini e-posta ile alın.
            </p>
            <Link
              to="/auth"
              className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-white text-green-800 font-bold hover:bg-green-50 transition-all shadow-lg"
            >
              Hesap Oluştur
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center text-sm text-stone-500">
        © 2026 TarımBorsa. Türkiye tarım fiyat takip platformu.
      </footer>
    </>
  );
}
