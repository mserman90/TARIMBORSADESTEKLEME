/*
# Create agricultural support programs and news tables

1. New Tables
- `agri_supports`: Stores verified agricultural support program data (seed data from official sources)
  - id, title, slug, agency, category, summary, description, amount_text, unit_amount,
    status ('active'|'upcoming'|'closed'), application_start, application_end,
    eligibility, required_documents, application_method, official_url,
    featured, sort_order, verified_at, created_at, updated_at
- `agri_news`: Stores agricultural news articles fetched from Google News RSS
  - id, title, link, source, pub_date, topic, intelligence (jsonb), created_at
  - Unique constraint on title to prevent duplicates from re-fetching

2. Security
- Both tables are public/read-only for all users (anon + authenticated)
- No write policies needed — data is managed via service role (edge functions) and migrations

3. Notes
- agri_supports contains ONLY verified data from Resmî Gazete and official ministry sources
- agri_news is populated by the fetch-agri-news edge function from Google News RSS
- status field follows the spec: active = open now, upcoming = next call expected, closed = period ended
*/

CREATE TABLE IF NOT EXISTS agri_supports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  agency text NOT NULL,
  category text NOT NULL,
  summary text NOT NULL,
  description text,
  amount_text text NOT NULL,
  unit_amount numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'upcoming', 'closed')),
  application_start text,
  application_end text,
  eligibility text[],
  required_documents text[],
  application_method text,
  official_url text,
  featured boolean DEFAULT false,
  sort_order integer DEFAULT 0,
  verified_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE agri_supports ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_agri_supports" ON agri_supports;
CREATE POLICY "anon_read_agri_supports" ON agri_supports FOR SELECT
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS agri_news (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  link text,
  source text,
  pub_date timestamptz,
  topic text NOT NULL,
  intelligence jsonb DEFAULT '{}'::jsonb,
  score integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE (title)
);

ALTER TABLE agri_news ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_read_agri_news" ON agri_news;
CREATE POLICY "anon_read_agri_news" ON agri_news FOR SELECT
  TO anon, authenticated USING (true);

-- Index for sorting news by date
CREATE INDEX IF NOT EXISTS idx_agri_news_pub_date ON agri_news (pub_date DESC);
CREATE INDEX IF NOT EXISTS idx_agri_news_topic ON agri_news (topic);
