/*
# Add missing livestock and agriculture products

1. Adds missing Hayvancılık products:
   - Canlı Koyun, Canlı Kuzu, Koyun Eti, Kuzu Eti, Kanatlı Eti (Tavuk), Balık
2. Adds missing Tahıllar product: Yulaf
3. Adds missing Bakliyat product: Yeşil Mercimek
4. Adds missing Yağlı Tohumlar: Aspir
5. Adds missing Meyve & Sebze: Biber, Salatalık, Portakal, Limon
6. Adds missing Diğer: Susam, Antep Fıstığı
All with realistic bourse assignments.
*/

INSERT INTO products (name, slug, category_id, unit, bourse_name) VALUES
  -- Hayvancılık - eklenenler
  ('Canlı Koyun', 'canli-koyun', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Konya Ticaret Borsası'),
  ('Canlı Kuzu', 'canli-kuzu', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Konya Ticaret Borsası'),
  ('Koyun Eti', 'koyun-eti', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'İstanbul Ticaret Borsası'),
  ('Kuzu Eti', 'kuzu-eti', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'İstanbul Ticaret Borsası'),
  ('Tavuk Eti', 'tavuk-eti', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'İzmir Ticaret Borsası'),
  ('Balık (Hamsi)', 'balik-hamsi', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Trabzon Ticaret Borsası'),
  ('Bal (Arı)', 'bal', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Ordu Ticaret Borsası'),
  -- Tahıllar - ek
  ('Yulaf', 'yulaf', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Konya Ticaret Borsası'),
  ('Çavdar', 'cavdar', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Konya Ticaret Borsası'),
  ('Tritikale', 'tritikale', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Eskişehir Ticaret Borsası'),
  -- Bakliyat - ek
  ('Yeşil Mercimek', 'yesil-mercimek', (SELECT id FROM categories WHERE slug='bakliyat'), 'kg', 'Isparta Ticaret Borsası'),
  ('Börülce', 'borulce', (SELECT id FROM categories WHERE slug='bakliyat'), 'kg', 'İzmir Ticaret Borsası'),
  -- Yağlı Tohumlar - ek
  ('Aspir', 'aspir', (SELECT id FROM categories WHERE slug='yagli-tohumlar'), 'kg', 'Konya Ticaret Borsası'),
  ('Haşhaş', 'hashas', (SELECT id FROM categories WHERE slug='yagli-tohumlar'), 'kg', 'Afyon Ticaret Borsası'),
  -- Meyve & Sebze - ek
  ('Biber', 'biber', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Antalya Ticaret Borsası'),
  ('Salatalık', 'salatalik', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Antalya Ticaret Borsası'),
  ('Portakal', 'portakal', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Mersin Ticaret Borsası'),
  ('Limon', 'limon', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Mersin Ticaret Borsası'),
  ('Üzüm', 'uzum', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Manisa Ticaret Borsası'),
  ('Karpuz', 'karpuz', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Adana Ticaret Borsası'),
  -- Diğer - ek
  ('Susam', 'susam', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Şanlıurfa Ticaret Borsası'),
  ('Antep Fıstığı', 'antep-fistigi', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Gaziantep Ticaret Borsası'),
  ('Zeytin', 'zeytin', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Balıkesir Ticaret Borsası'),
  ('Kuru İncir', 'kuru-incir', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Aydın Ticaret Borsası'),
  ('Kuru Kayısı', 'kuru-kayisi', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Malatya Ticaret Borsası')
ON CONFLICT (slug) DO NOTHING;
