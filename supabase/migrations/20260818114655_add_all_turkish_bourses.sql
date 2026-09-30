/*
# Add products for missing Turkish commodity exchanges

1. Adds products for major Turkish Ticaret Borsaları not yet represented:
   - Bursa, Samsun, Kayseri, Denizli, Kahramanmaraş, Diyarbakır, Hatay,
     Tokat, Sakarya, Muğla, Kütahya, Niğde, Nevşehir, Karaman, Aksaray,
     Amasya, Çorum, Erzurum, Van, Burdur, Osmaniye, Adıyaman, Mardin,
     Uşak, Kırşehir, Yozgat, Bolu, Zonguldak, Sinop, Gümüşhane,
     Erzincan, Kars, Siirt, Batman, Şırnak, Hakkari, Muş, Bingöl,
     Bayburt, Ardahan, Iğdır, Ağrı, Bitlis, Kilis, Düzce, Karabük,
     Bartın, Çankırı, Kastamonu, Tokat
2. Each product gets a realistic bourse assignment based on regional specialty
3. 30 days of price data will be generated separately
*/

INSERT INTO products (name, slug, category_id, unit, bourse_name) VALUES
  -- Bursa Ticaret Borsası
  ('Şeftali', 'seftali', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Bursa Ticaret Borsası'),
  ('Karadut', 'karadut', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Bursa Ticaret Borsası'),
  -- Samsun Ticaret Borsası
  ('Tütün', 'tutun', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Samsun Ticaret Borsası'),
  ('Fındık (Samsun)', 'findik-samsun', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Samsun Ticaret Borsası'),
  -- Kayseri Ticaret Borsası
  ('Mercimek (Kayseri)', 'mercimek-kayseri', (SELECT id FROM categories WHERE slug='bakliyat'), 'kg', 'Kayseri Ticaret Borsası'),
  ('Şeker (Kayseri)', 'seker-kayseri', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Kayseri Ticaret Borsası'),
  -- Denizli Ticaret Borsası
  ('Tavuk Eti (Denizli)', 'tavuk-eti-denizli', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Denizli Ticaret Borsası'),
  ('Pamuk (Denizli)', 'pamuk-denizli', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Denizli Ticaret Borsası'),
  -- Kahramanmaraş Ticaret Borsası
  ('Kırmızı Biber (K.Maraş)', 'kirmizi-biber-kmaras', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Kahramanmaraş Ticaret Borsası'),
  ('Antep Fıstığı (K.Maraş)', 'antep-fistigi-kmaras', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Kahramanmaraş Ticaret Borsası'),
  -- Diyarbakır Ticaret Borsası
  ('Buğday (Diyarbakır)', 'bugday-diyarbakir', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Diyarbakır Ticaret Borsası'),
  ('Karpuz (Diyarbakır)', 'karpuz-diyarbakir', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Diyarbakır Ticaret Borsası'),
  -- Hatay Ticaret Borsası
  ('Zeytin (Hatay)', 'zeytin-hatay', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Hatay Ticaret Borsası'),
  ('Portakal (Hatay)', 'portakal-hatay', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Hatay Ticaret Borsası'),
  -- Tokat Ticaret Borsası
  ('Üzüm (Tokat)', 'uzum-tokat', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Tokat Ticaret Borsası'),
  ('Buğday (Tokat)', 'bugday-tokat', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Tokat Ticaret Borsası'),
  -- Sakarya Ticaret Borsası
  ('Ayçiçeği (Sakarya)', 'aycicegi-sakarya', (SELECT id FROM categories WHERE slug='yagli-tohumlar'), 'kg', 'Sakarya Ticaret Borsası'),
  ('Mısır (Sakarya)', 'misir-sakarya', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Sakarya Ticaret Borsası'),
  -- Muğla Ticaret Borsası
  ('Zeytin (Muğla)', 'zeytin-mugla', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Muğla Ticaret Borsası'),
  ('Bal (Muğla)', 'bal-mugla', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Muğla Ticaret Borsası'),
  -- Kütahya Ticaret Borsası
  ('Buğday (Kütahya)', 'bugday-kutahya', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Kütahya Ticaret Borsası'),
  ('Haşhaş (Kütahya)', 'hashas-kutahya', (SELECT id FROM categories WHERE slug='yagli-tohumlar'), 'kg', 'Kütahya Ticaret Borsası'),
  -- Niğde Ticaret Borsası
  ('Patates (Niğde)', 'patates-nigde', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Niğde Ticaret Borsası'),
  ('Arpa (Niğde)', 'arpa-nigde', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Niğde Ticaret Borsası'),
  -- Nevşehir Ticaret Borsası
  ('Patates (Nevşehir)', 'patates-nevsehir', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Nevşehir Ticaret Borsası'),
  ('Buğday (Nevşehir)', 'bugday-nevsehir', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Nevşehir Ticaret Borsası'),
  -- Karaman Ticaret Borsası
  ('Arpa (Karaman)', 'arpa-karaman', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Karaman Ticaret Borsası'),
  ('Elma (Karaman)', 'elma-karaman', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Karaman Ticaret Borsası'),
  -- Aksaray Ticaret Borsası
  ('Buğday (Aksaray)', 'bugday-aksaray', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Aksaray Ticaret Borsası'),
  ('Arpa (Aksaray)', 'arpa-aksaray', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Aksaray Ticaret Borsası'),
  -- Amasya Ticaret Borsası
  ('Elma (Amasya)', 'elma-amasya', (SELECT id FROM categories WHERE slug='meyve-sebze'), 'kg', 'Amasya Ticaret Borsası'),
  ('Tütün (Amasya)', 'tutun-amasya', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Amasya Ticaret Borsası'),
  -- Çorum Ticaret Borsası
  ('Buğday (Çorum)', 'bugday-corum', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Çorum Ticaret Borsası'),
  ('Nohut (Çorum)', 'nohut-corum', (SELECT id FROM categories WHERE slug='bakliyat'), 'kg', 'Çorum Ticaret Borsası'),
  -- Erzurum Ticaret Borsası
  ('Canlı Koyun (Erzurum)', 'canli-koyun-erzurum', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Erzurum Ticaret Borsası'),
  ('Buğday (Erzurum)', 'bugday-erzurum', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Erzurum Ticaret Borsası'),
  -- Van Ticaret Borsası
  ('Canlı Koyun (Van)', 'canli-koyun-van', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Van Ticaret Borsası'),
  ('Arpa (Van)', 'arpa-van', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Van Ticaret Borsası'),
  -- Burdur Ticaret Borsası
  ('Mercimek (Burdur)', 'mercimek-burdur', (SELECT id FROM categories WHERE slug='bakliyat'), 'kg', 'Burdur Ticaret Borsası'),
  ('Arpa (Burdur)', 'arpa-burdur', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Burdur Ticaret Borsası'),
  -- Osmaniye Ticaret Borsası
  ('Ayçiçeği (Osmaniye)', 'aycicegi-osmaniye', (SELECT id FROM categories WHERE slug='yagli-tohumlar'), 'kg', 'Osmaniye Ticaret Borsası'),
  ('Fıstık (Osmaniye)', 'fistik-osmaniye', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Osmaniye Ticaret Borsası'),
  -- Adıyaman Ticaret Borsası
  ('Buğday (Adıyaman)', 'bugday-adiyaman', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Adıyaman Ticaret Borsası'),
  ('Pistachio (Adıyaman)', 'antep-fistigi-adiyaman', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Adıyaman Ticaret Borsası'),
  -- Mardin Ticaret Borsası
  ('Buğday (Mardin)', 'bugday-mardin', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Mardin Ticaret Borsası'),
  ('Arpa (Mardin)', 'arpa-mardin', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Mardin Ticaret Borsası'),
  -- Uşak Ticaret Borsası
  ('Tütün (Uşak)', 'tutun-usak', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Uşak Ticaret Borsası'),
  ('Buğday (Uşak)', 'bugday-usak', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Uşak Ticaret Borsası'),
  -- Kırşehir Ticaret Borsası
  ('Buğday (Kırşehir)', 'bugday-kirsehir', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Kırşehir Ticaret Borsası'),
  ('Mercimek (Kırşehir)', 'mercimek-kirsehir', (SELECT id FROM categories WHERE slug='bakliyat'), 'kg', 'Kırşehir Ticaret Borsası'),
  -- Yozgat Ticaret Borsası
  ('Buğday (Yozgat)', 'bugday-yozgat', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Yozgat Ticaret Borsası'),
  ('Arpa (Yozgat)', 'arpa-yozgat', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Yozgat Ticaret Borsası'),
  -- Bolu Ticaret Borsası
  ('Mısır (Bolu)', 'misir-bolu', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Bolu Ticaret Borsası'),
  ('Süt (Bolu)', 'sut-bolu', (SELECT id FROM categories WHERE slug='hayvancilik'), 'lt', 'Bolu Ticaret Borsası'),
  -- Zonguldak Ticaret Borsası
  ('Mısır (Zonguldak)', 'misir-zonguldak', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Zonguldak Ticaret Borsası'),
  ('Buğday (Zonguldak)', 'bugday-zonguldak', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Zonguldak Ticaret Borsası'),
  -- Sinop Ticaret Borsası
  ('Buğday (Sinop)', 'bugday-sinop', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Sinop Ticaret Borsası'),
  ('Balık (Sinop)', 'balik-sinop', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Sinop Ticaret Borsası'),
  -- Gümüşhane Ticaret Borsası
  ('Buğday (Gümüşhane)', 'bugday-gumushane', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Gümüşhane Ticaret Borsası'),
  ('Bal (Gümüşhane)', 'bal-gumushane', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Gümüşhane Ticaret Borsası'),
  -- Erzincan Ticaret Borsası
  ('Buğday (Erzincan)', 'bugday-erzincan', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Erzincan Ticaret Borsası'),
  ('Canlı Koyun (Erzincan)', 'canli-koyun-erzincan', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Erzincan Ticaret Borsası'),
  -- Kars Ticaret Borsası
  ('Canlı Koyun (Kars)', 'canli-koyun-kars', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Kars Ticaret Borsası'),
  ('Buğday (Kars)', 'bugday-kars', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Kars Ticaret Borsası'),
  -- Siirt Ticaret Borsası
  ('Antep Fıstığı (Siirt)', 'antep-fistigi-siirt', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Siirt Ticaret Borsası'),
  ('Buğday (Siirt)', 'bugday-siirt', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Siirt Ticaret Borsası'),
  -- Batman Ticaret Borsası
  ('Buğday (Batman)', 'bugday-batman', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Batman Ticaret Borsası'),
  ('Arpa (Batman)', 'arpa-batman', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Batman Ticaret Borsası'),
  -- Şırnak Ticaret Borsası
  ('Buğday (Şırnak)', 'bugday-sirnak', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Şırnak Ticaret Borsası'),
  ('Arpa (Şırnak)', 'arpa-sirnak', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Şırnak Ticaret Borsası'),
  -- Hakkari Ticaret Borsası
  ('Buğday (Hakkari)', 'bugday-hakkari', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Hakkari Ticaret Borsası'),
  ('Canlı Koyun (Hakkari)', 'canli-koyun-hakkari', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Hakkari Ticaret Borsası'),
  -- Muş Ticaret Borsası
  ('Buğday (Muş)', 'bugday-mus', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Muş Ticaret Borsası'),
  ('Canlı Koyun (Muş)', 'canli-koyun-mus', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Muş Ticaret Borsası'),
  -- Bingöl Ticaret Borsası
  ('Buğday (Bingöl)', 'bugday-bingol', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Bingöl Ticaret Borsası'),
  ('Canlı Koyun (Bingöl)', 'canli-koyun-bingol', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Bingöl Ticaret Borsası'),
  -- Bayburt Ticaret Borsası
  ('Buğday (Bayburt)', 'bugday-bayburt', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Bayburt Ticaret Borsası'),
  ('Arpa (Bayburt)', 'arpa-bayburt', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Bayburt Ticaret Borsası'),
  -- Ardahan Ticaret Borsası
  ('Canlı Koyun (Ardahan)', 'canli-koyun-ardahan', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Ardahan Ticaret Borsası'),
  ('Buğday (Ardahan)', 'bugday-ardahan', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Ardahan Ticaret Borsası'),
  -- Iğdır Ticaret Borsası
  ('Buğday (Iğdır)', 'bugday-igdir', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Iğdır Ticaret Borsası'),
  ('Arpa (Iğdır)', 'arpa-igdir', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Iğdır Ticaret Borsası'),
  -- Ağrı Ticaret Borsası
  ('Buğday (Ağrı)', 'bugday-agri', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Ağrı Ticaret Borsası'),
  ('Canlı Koyun (Ağrı)', 'canli-koyun-agri', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Ağrı Ticaret Borsası'),
  -- Bitlis Ticaret Borsası
  ('Buğday (Bitlis)', 'bugday-bitlis', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Bitlis Ticaret Borsası'),
  ('Canlı Koyun (Bitlis)', 'canli-koyun-bitlis', (SELECT id FROM categories WHERE slug='hayvancilik'), 'kg', 'Bitlis Ticaret Borsası'),
  -- Kilis Ticaret Borsası
  ('Antep Fıstığı (Kilis)', 'antep-fistigi-kilis', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Kilis Ticaret Borsası'),
  ('Zeytin (Kilis)', 'zeytin-kilis', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Kilis Ticaret Borsası'),
  -- Düzce Ticaret Borsası
  ('Fındık (Düzce)', 'findik-duzce', (SELECT id FROM categories WHERE slug='diger'), 'kg', 'Düzce Ticaret Borsası'),
  ('Mısır (Düzce)', 'misir-duzce', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Düzce Ticaret Borsası'),
  -- Karabük Ticaret Borsası
  ('Mısır (Karabük)', 'misir-karabuk', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Karabük Ticaret Borsası'),
  ('Buğday (Karabük)', 'bugday-karabuk', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Karabük Ticaret Borsası'),
  -- Bartın Ticaret Borsası
  ('Mısır (Bartın)', 'misir-bartin', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Bartın Ticaret Borsası'),
  ('Buğday (Bartın)', 'bugday-bartin', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Bartın Ticaret Borsası'),
  -- Çankırı Ticaret Borsası
  ('Buğday (Çankırı)', 'bugday-cankiri', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Çankırı Ticaret Borsası'),
  ('Arpa (Çankırı)', 'arpa-cankiri', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Çankırı Ticaret Borsası'),
  -- Kastamonu Ticaret Borsası
  ('Buğday (Kastamonu)', 'bugday-kastamonu', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Kastamonu Ticaret Borsası'),
  ('Arpa (Kastamonu)', 'arpa-kastamonu', (SELECT id FROM categories WHERE slug='tahillar'), 'kg', 'Kastamonu Ticaret Borsası')
ON CONFLICT (slug) DO NOTHING;
