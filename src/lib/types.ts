export interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  description: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category_id: string;
  unit: string;
  bourse_name: string;
  created_at: string;
}

export interface PriceData {
  id: string;
  product_id: string;
  price: number;
  date: string;
  change_pct: number;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  category_id: string;
  frequency: 'daily' | 'weekly' | 'instant';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NotificationLog {
  id: string;
  user_id: string;
  subject: string;
  content: string;
  sent_at: string;
  status: string;
}

export interface ProductWithLatest extends Product {
  category?: Category;
  latest_price?: PriceData;
  previous_price?: PriceData;
}

export interface AgriSupport {
  id: string;
  title: string;
  slug: string;
  agency: string;
  category: string;
  summary: string;
  description: string | null;
  amount_text: string;
  unit_amount: number;
  status: 'active' | 'upcoming' | 'closed';
  application_start: string | null;
  application_end: string | null;
  eligibility: string[] | null;
  required_documents: string[] | null;
  application_method: string | null;
  official_url: string | null;
  featured: boolean;
  sort_order: number;
  verified_at: string;
  created_at: string;
  updated_at: string;
}

export interface AgriNews {
  id: string;
  title: string;
  link: string | null;
  source: string | null;
  pub_date: string | null;
  topic: string;
  intelligence: {
    amounts?: string[];
    percents?: string[];
    dates?: string[];
    years?: string[];
    orgs?: string[];
  } | null;
  score: number;
  created_at: string;
}

export const STATUS_LABELS: Record<string, string> = {
  active: 'Aktif',
  upcoming: 'Yaklaşan',
  closed: 'Kapandı',
};

export const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-50 text-green-700 border-green-200',
  upcoming: 'bg-amber-50 text-amber-700 border-amber-200',
  closed: 'bg-stone-100 text-stone-500 border-stone-200',
};

export const TOPIC_LABELS: Record<string, string> = {
  destek: 'Destek',
  fiyat: 'Fiyat',
  iklim: 'İklim',
  hibe: 'Hibe',
};

export const TOPIC_COLORS: Record<string, string> = {
  destek: 'bg-blue-50 text-blue-700 border-blue-200',
  fiyat: 'bg-green-50 text-green-700 border-green-200',
  iklim: 'bg-cyan-50 text-cyan-700 border-cyan-200',
  hibe: 'bg-amber-50 text-amber-700 border-amber-200',
};

export const FREQUENCY_LABELS: Record<string, string> = {
  daily: 'Günlük',
  weekly: 'Haftalık',
  instant: 'Anlık Alarm',
};
