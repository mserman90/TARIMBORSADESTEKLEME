import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { Category, Subscription, FREQUENCY_LABELS } from '@/lib/types';
import { Mail, Bell, Check, Loader2, Inbox } from 'lucide-react';

export function SettingsPage() {
  const { user } = useAuth();
  const [categories, setCategories] = useState<Category[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [logs, setLogs] = useState<{ subject: string; sent_at: string; status: string }[]>([]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;

      const [{ data: cats }, { data: subs }, { data: logsData }] = await Promise.all([
        supabase.from('categories').select('*').order('name'),
        supabase.from('subscriptions').select('*').eq('user_id', user.id),
        supabase
          .from('notification_logs')
          .select('subject, sent_at, status')
          .eq('user_id', user.id)
          .order('sent_at', { ascending: false })
          .limit(10),
      ]);

      setCategories(cats || []);
      setSubscriptions(subs || []);
      setLogs(logsData || []);
      setLoading(false);
    }
    fetchData();
  }, [user]);

  const getSubForCategory = (catId: string) =>
    subscriptions.find((s) => s.category_id === catId);

  const handleToggle = async (catId: string) => {
    if (!user) return;
    const existing = getSubForCategory(catId);

    setSaving(catId);

    if (existing) {
      const { error } = await supabase
        .from('subscriptions')
        .delete()
        .eq('id', existing.id);
      if (!error) {
        setSubscriptions(subscriptions.filter((s) => s.id !== existing.id));
      }
    } else {
      const { data, error } = await supabase
        .from('subscriptions')
        .insert({
          user_id: user.id,
          category_id: catId,
          frequency: 'daily',
          is_active: true,
        })
        .select('*')
        .single();
      if (!error && data) {
        setSubscriptions([...subscriptions, data as Subscription]);
      }
    }

    setSaving(null);
  };

  const handleFrequencyChange = async (catId: string, frequency: string) => {
    if (!user) return;
    const existing = getSubForCategory(catId);
    if (!existing) return;

    setSaving(catId);
    const { data, error } = await supabase
      .from('subscriptions')
      .update({ frequency, updated_at: new Date().toISOString() })
      .eq('id', existing.id)
      .select('*')
      .single();

    if (!error && data) {
      setSubscriptions(
        subscriptions.map((s) => (s.id === existing.id ? (data as Subscription) : s))
      );
    }
    setSaving(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-700" />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-stone-800">Abonelik Tercihleri</h1>
        <p className="text-stone-500 mt-1">
          Hangi kategorilerin fiyat bildirimlerini e-posta ile alacağınızı seçin
        </p>
      </div>

      {/* Email info */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center">
          <Mail className="w-5 h-5 text-green-700" />
        </div>
        <div>
          <div className="text-sm font-medium text-stone-800">Bildirim e-posta adresiniz</div>
          <div className="text-sm text-stone-600">{user?.email}</div>
        </div>
      </div>

      {/* Category subscriptions */}
      <div className="space-y-3 mb-8">
        {categories.map((cat) => {
          const sub = getSubForCategory(cat.id);
          const isSubscribed = !!sub;
          return (
            <div
              key={cat.id}
              className={`bg-white rounded-xl border p-4 transition-all ${
                isSubscribed ? 'border-green-300 shadow-sm' : 'border-stone-200'
              }`}
            >
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-stone-800">{cat.name}</div>
                  <div className="text-sm text-stone-500 mt-0.5">{cat.description}</div>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  {isSubscribed && (
                    <div className="flex gap-1 p-1 bg-stone-100 rounded-lg">
                      {(['daily', 'weekly', 'instant'] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => handleFrequencyChange(cat.id, f)}
                          className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                            sub?.frequency === f
                              ? 'bg-white text-stone-800 shadow-sm'
                              : 'text-stone-500'
                          }`}
                        >
                          {FREQUENCY_LABELS[f]}
                        </button>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleToggle(cat.id)}
                    disabled={saving === cat.id}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                      isSubscribed
                        ? 'bg-green-50 text-green-700 hover:bg-green-100'
                        : 'bg-green-700 text-white hover:bg-green-800'
                    } disabled:opacity-50`}
                  >
                    {saving === cat.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isSubscribed ? (
                      <>
                        <Check className="w-4 h-4" />
                        Abone
                      </>
                    ) : (
                      'Abone Ol'
                    )}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Notification history */}
      <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-200">
          <h2 className="font-bold text-stone-800 flex items-center gap-2">
            <Bell className="w-4 h-4 text-stone-400" />
            Bildirim Geçmişi
          </h2>
        </div>
        {logs.length === 0 ? (
          <div className="px-5 py-12 text-center text-stone-400">
            <Inbox className="w-10 h-10 mx-auto mb-3 opacity-40" />
            <p className="text-sm">Henüz bildirim gönderilmedi</p>
            <p className="text-xs mt-1">
              Abone olduğunuzda fiyat bildirimleri burada görünecek
            </p>
          </div>
        ) : (
          <div className="divide-y divide-stone-100">
            {logs.map((log, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center">
                    <Mail className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-medium text-stone-800">{log.subject}</div>
                    <div className="text-xs text-stone-500">
                      {new Date(log.sent_at).toLocaleDateString('tr-TR', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </div>
                </div>
                <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-md">
                  {log.status === 'sent' ? 'Gönderildi' : log.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
