import { useEffect, useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { AgriNews, TOPIC_LABELS, TOPIC_COLORS } from '@/lib/types';
import {
  Newspaper,
  ExternalLink,
  RefreshCw,
  Loader2,
  AlertCircle,
  Clock,
  TrendingUp,
} from 'lucide-react';

export function NewsPage() {
  const [news, setNews] = useState<AgriNews[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTopic, setActiveTopic] = useState<string>('all');
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [refreshError, setRefreshError] = useState<string | null>(null);

  const fetchNews = useCallback(async () => {
    const { data, error } = await supabase
      .from('agri_news')
      .select('*')
      .order('pub_date', { ascending: false })
      .limit(50);

    if (!error && data) {
      setNews(data as AgriNews[]);
      if (data.length > 0) {
        setLastUpdated(data[0].created_at);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNews();
  }, [fetchNews]);

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshError(null);
    try {
      const apiUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/fetch-agri-news`;
      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const result = await res.json();
      if (!result.success) {
        setRefreshError('Haber kaynağına ulaşılamadı. Lütfen daha sonra tekrar deneyin.');
      }
      await fetchNews();
    } catch {
      setRefreshError('Bağlantı hatası. Lütfen tekrar deneyin.');
    }
    setRefreshing(false);
  };

  const filtered = activeTopic === 'all' ? news : news.filter((n) => n.topic === activeTopic);

  const topics = [
    { key: 'all', label: 'Tümü', count: news.length },
    { key: 'destek', label: 'Destek', count: news.filter((n) => n.topic === 'destek').length },
    { key: 'fiyat', label: 'Fiyat', count: news.filter((n) => n.topic === 'fiyat').length },
    { key: 'iklim', label: 'İklim', count: news.filter((n) => n.topic === 'iklim').length },
    { key: 'hibe', label: 'Hibe', count: news.filter((n) => n.topic === 'hibe').length },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <Loader2 className="w-8 h-8 animate-spin text-green-700" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-stone-800">Tarım Haberleri</h1>
          <p className="text-stone-500 mt-1">
            Google News üzerinden tarım, destek ve fiyat haberleri
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium bg-white border border-stone-200 text-stone-600 hover:border-green-300 hover:text-green-700 transition-all disabled:opacity-50"
        >
          {refreshing ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          Yenile
        </button>
      </div>

      {/* Live badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-50 border border-green-200 text-green-700 text-xs font-bold">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          CANLI
        </span>
        {lastUpdated && (
          <span className="text-xs text-stone-400">
            Güncellendi {new Date(lastUpdated).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>

      {refreshError && (
        <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-amber-50 border border-amber-200 text-amber-700 text-sm">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {refreshError}
        </div>
      )}

      {/* Topic filter */}
      <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1">
        {topics.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTopic(t.key)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
              activeTopic === t.key
                ? 'bg-green-700 text-white'
                : 'bg-white border border-stone-200 text-stone-600 hover:border-stone-300'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {/* News list */}
      <div className="space-y-3">
        {filtered.map((n) => {
          const intel = n.intelligence || {};
          return (
            <a
              key={n.id}
              href={n.link || '#'}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white rounded-xl border border-stone-200 p-4 hover:border-green-300 hover:shadow-md transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-stone-100 flex items-center justify-center flex-shrink-0">
                  <Newspaper className="w-5 h-5 text-stone-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-stone-800 group-hover:text-green-700 transition-colors mb-1.5">
                    {n.title}
                  </h3>
                  <div className="flex items-center gap-3 flex-wrap text-xs">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-md font-medium border ${TOPIC_COLORS[n.topic] || 'bg-stone-50 text-stone-600 border-stone-200'}`}>
                      {TOPIC_LABELS[n.topic] || n.topic}
                    </span>
                    {n.source && (
                      <span className="text-stone-500">{n.source}</span>
                    )}
                    {n.pub_date && (
                      <span className="flex items-center gap-1 text-stone-400">
                        <Clock className="w-3 h-3" />
                        {new Date(n.pub_date).toLocaleDateString('tr-TR', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    {intel.amounts && intel.amounts.length > 0 && (
                      <span className="flex items-center gap-1 text-green-600 font-medium">
                        <TrendingUp className="w-3 h-3" />
                        {intel.amounts.slice(0, 2).join(', ')}
                      </span>
                    )}
                    {intel.percents && intel.percents.length > 0 && (
                      <span className="text-blue-600 font-medium">
                        {intel.percents.slice(0, 2).join(', ')}
                      </span>
                    )}
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-stone-300 group-hover:text-green-500 transition-colors flex-shrink-0 mt-1" />
              </div>
            </a>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20 text-stone-400">
          <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-40" />
          <p>Bu kategoride henüz haber yok. "Yenile" butonuyla haberleri çekebilirsiniz.</p>
        </div>
      )}
    </div>
  );
}
