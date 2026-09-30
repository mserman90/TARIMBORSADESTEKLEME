/*
# Tarım Fiyat Takip - Initial Schema

1. New Tables
- `categories`: Ürün kategorileri (Tahıllar, Bakliyat, vb.)
  - id (uuid, PK), name (text), slug (text, unique), icon (text), description (text), created_at
- `products`: Takip edilen ürünler
  - id (uuid, PK), name (text), slug (text, unique), category_id (FK -> categories), unit (text), bourse_name (text), created_at
- `price_data`: Günlük fiyat verileri
  - id (uuid, PK), product_id (FK -> products), price (numeric), date (date), change_pct (numeric), created_at
- `subscriptions`: Kullanıcı abonelik tercihleri
  - id (uuid, PK), user_id (uuid, DEFAULT auth.uid(), FK -> auth.users), category_id (FK -> categories), frequency (text: daily/weekly/instant), is_active (boolean), created_at, updated_at
- `notification_logs`: Gönderilen e-posta bildirimleri logu
  - id (uuid, PK), user_id (uuid, FK -> auth.users), subject (text), sent_at (timestamptz), status (text), content (text)

2. Security
- categories: public read (anon + authenticated SELECT), no writes from client
- products: public read (anon + authenticated SELECT), no writes from client
- price_data: public read (anon + authenticated SELECT), no writes from client
- subscriptions: owner-scoped CRUD (authenticated only, auth.uid() = user_id)
- notification_logs: owner-scoped read only (authenticated, auth.uid() = user_id)
3. Indexes
- price_data: (product_id, date) for fast lookups
- subscriptions: (user_id) for user's subscription queries
*/

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  icon text NOT NULL DEFAULT 'Wheat',
  description text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_categories" ON categories;
CREATE POLICY "public_read_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  unit text NOT NULL DEFAULT 'kg',
  bourse_name text NOT NULL DEFAULT 'Borsa İstanbul',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_products" ON products;
CREATE POLICY "public_read_products" ON products FOR SELECT
  TO anon, authenticated USING (true);

-- Price Data
CREATE TABLE IF NOT EXISTS price_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  price numeric(12,2) NOT NULL,
  date date NOT NULL,
  change_pct numeric(6,2) DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_price_data_product_date ON price_data(product_id, date DESC);

ALTER TABLE price_data ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_price_data" ON price_data;
CREATE POLICY "public_read_price_data" ON price_data FOR SELECT
  TO anon, authenticated USING (true);

-- Subscriptions (user-owned)
CREATE TABLE IF NOT EXISTS subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  frequency text NOT NULL DEFAULT 'daily' CHECK (frequency IN ('daily', 'weekly', 'instant')),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions(user_id);

ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_subscriptions" ON subscriptions;
CREATE POLICY "select_own_subscriptions" ON subscriptions FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_subscriptions" ON subscriptions;
CREATE POLICY "insert_own_subscriptions" ON subscriptions FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_subscriptions" ON subscriptions;
CREATE POLICY "update_own_subscriptions" ON subscriptions FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_subscriptions" ON subscriptions;
CREATE POLICY "delete_own_subscriptions" ON subscriptions FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

-- Notification Logs (user-owned, read only from client)
CREATE TABLE IF NOT EXISTS notification_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  subject text NOT NULL,
  content text,
  sent_at timestamptz DEFAULT now(),
  status text NOT NULL DEFAULT 'sent'
);

CREATE INDEX IF NOT EXISTS idx_notification_logs_user ON notification_logs(user_id);

ALTER TABLE notification_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_notification_logs" ON notification_logs;
CREATE POLICY "select_own_notification_logs" ON notification_logs FOR SELECT
  TO authenticated USING (auth.uid() = user_id);
