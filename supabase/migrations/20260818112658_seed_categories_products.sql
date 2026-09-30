/*
# Seed Categories and Products

1. Inserts 6 categories: Tahıllar, Bakliyat, Yağlı Tohumlar, Hayvancılık, Meyve & Sebze, Diğer
2. Inserts ~24 products across those categories with realistic bourse names
3. Safe to re-run (uses ON CONFLICT DO NOTHING on slug)
*/

-- Categories
INSERT INTO categories (name, slug, icon, description) VALUES
  ('Tahıllar', 'tahillar', 'Wheat', 'Buğday, arpa, mısır, pirinç gibi tahıl ürünleri'),
  ('Bakliyat', 'bakliyat', 'Bean', 'Nohut, mercimek, fasulye gibi bakliyat ürünleri'),
  ('Yağlı Tohumlar', 'yagli-tohumlar', 'Sun', 'Ayçiçeği, soya, kanola gibi yağlı tohumlar'),
  ('Hayvancılık', 'hayvancilik', 'Beef', 'Canlı hayvan, et, süt, yumurta gibi hayvancılık ürünleri'),
  ('Meyve & Sebze', 'meyve-sebze', 'Apple', 'Soğan, patates, domates, elma gibi ürünler'),
  ('Diğer', 'diger', 'Leaf', 'Şeker pancarı, pamuk, fındık, çay gibi diğer ürünler')
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO products (name, slug, category_id, unit, bourse_name) VALUES
  -- Tahıllar
  ('Buğday', 'bugday', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Konya Ticaret Borsası'),
  ('Arpa', 'arpa', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Konya Ticaret Borsası'),
  ('Mısır', 'misir', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'İzmir Ticaret Borsası'),
  ('Pirinç', 'pirinc', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Edirne Ticaret Borsası'),
  -- Bakliyat
  ('Nohut', 'nohut', (SELECT id FROM categories WHERE slug='bakliyat'), 'kg', 'Ankara Ticaret Borsası'),
  ('Mercimek', 'mercimek', (SELECT id FROM categories WHERE slug='bakliyat'), 'kg', 'Gaziantep Ticaret Borsası'),
  ('Fasulye', 'fasulye', (SELECT id FROM categories WHERE slug='bakliyat'), 'kg', 'İzmir Ticaret Borsası'),
  -- Yağlı Tohumlar
  ('Ayçiçeği', 'aycicegi', (SELECT id FROM categories WHERE slug='yagli-tohumlar'), 'kg', 'Tekirdağ Ticaret Borsası'),
  ('Sya', 'soya', (SELECT id FROM categories WHERE slug='yagli-tohumlar'), 'kg', 'İzmir Ticaret Borsası'),
  ('Kanola', 'kanola', (SELECT id FROM categories WHERE slug='yagli-tohumlar'), 'kg', 'Tekirdağ Ticaret Borsası'),
  -- Hayvancılık
  ('Canlı Hayvan (Dana)', 'canli-hayvan-dana', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'İstanbul Ticaret Borsası'),
  ('Kırmızı Et', 'kirmizi-et', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'İstanbul Ticaret Borsası'),
  ('Süt', 'sut', (SELECT id FROM categories WHERE slug='hayvancilik'), 'lt', 'Konya Ticaret Borsası'),
  ('Yumurta', 'yumurta', (SELECT id FROM categories WHERE slug='hayvancilik'), 'adet', 'İzmir Ticaret Borsası'),
  -- Meyve & Sebze
  ('Soğan', 'sogan', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'İstanbul Ticaret Borsası'),
  ('Patates', 'patates', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'İzmir Ticaret Borsası'),
  ('Domates', 'domates', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Antalya Ticaret Borsası'),
  ('Elma', 'elma', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Isparta Ticaret Borsası'),
  -- Diğer
  ('Şeker Pancarı', 'seker-pancari', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Konya Ticaret Borsası'),
  ('Pamuk', 'pamuk', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Adana Ticaret Borsası'),
  ('Fındık', 'findik', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Giresun Ticaret Borsası'),
  ('Çay', 'cay', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Rize Ticaret Borsası')
ON CONFLICT (slug) DO NOTHING;
