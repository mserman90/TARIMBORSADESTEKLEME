import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { AgriSupport, STATUS_LABELS, STATUS_COLORS } from '@/lib/types';
import { SupportCalendar } from '@/components/SupportCalendar';
import {
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

export function SupportsPage() {
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
      <div className="flex items-center justify-center h-full py-20">
        <Loader2 className="w-8 h-8 animate-spin text-green-700" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Tarımsal Destekler</h1>
        <p className="text-stone-500 mt-1">
          Resmî Gazete ve Bakanlık duyurularından doğrulanmış güncel destek programları
        </p>
      </div>

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

      {/* Calendar widget */}
      <div className="mb-6">
        <SupportCalendar supports={supports} />
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
    </div>
  );
}
