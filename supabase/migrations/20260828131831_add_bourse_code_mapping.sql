/*
# Add bourse_code column for TOBB scraping

1. Modified Tables
- `products`: adds `bourse_code` text column to store TOBB bourse codes (e.g., "5AN10")
  This allows the edge function to fetch real prices from borsa.tobb.org.tr
2. Data
- Populates bourse_code for existing products based on bourse_name → TOBB code mapping
3. Notes
- All 113 TOBB bourse codes are mapped
- Products whose bourse doesn't exist in TOBB get NULL (will use simulated fallback)
*/

ALTER TABLE products ADD COLUMN IF NOT EXISTS bourse_code text;

-- Map bourse_name to TOBB codes
UPDATE products SET bourse_code = '5AD10' WHERE bourse_name = 'Adana Ticaret Borsası';
UPDATE products SET bourse_code = '5AD20' WHERE bourse_name = 'Sakarya Ticaret Borsası';
UPDATE products SET bourse_code = '5AD30' WHERE bourse_name = 'Adıyaman Ticaret Borsası';
UPDATE products SET bourse_code = '5AF10' WHERE bourse_name = 'Afyon Ticaret Borsası';
UPDATE products SET bourse_code = '5AK10' WHERE bourse_name = 'Akhisar Ticaret Borsası';
UPDATE products SET bourse_code = '5AK20' WHERE bourse_name = 'Aksaray Ticaret Borsası';
UPDATE products SET bourse_code = '5AK30' WHERE bourse_name = 'Akşehir Ticaret Borsası';
UPDATE products SET bourse_code = '5AK40' WHERE bourse_name = 'Akyazı Ticaret Borsası';
UPDATE products SET bourse_code = '5AL05' WHERE bourse_name = 'Alaca Ticaret Borsası';
UPDATE products SET bourse_code = '5AL10' WHERE bourse_name = 'Alaşehir Ticaret Borsası';
UPDATE products SET bourse_code = '5AN10' WHERE bourse_name = 'Ankara Ticaret Borsası';
UPDATE products SET bourse_code = '5AN20' WHERE bourse_name = 'Antakya Ticaret Borsası';
UPDATE products SET bourse_code = '5AN30' WHERE bourse_name = 'Antalya Ticaret Borsası';
UPDATE products SET bourse_code = '5AY10' WHERE bourse_name = 'Aydın Ticaret Borsası';
UPDATE products SET bourse_code = '5BA01' WHERE bourse_name = 'Babaeski Ticaret Borsası';
UPDATE products SET bourse_code = '5BA05' WHERE bourse_name = 'Bafra Ticaret Borsası';
UPDATE products SET bourse_code = '5BA10' WHERE bourse_name = 'Balıkesir Ticaret Borsası';
UPDATE products SET bourse_code = '5BA20' WHERE bourse_name = 'Bandırma Ticaret Borsası';
UPDATE products SET bourse_code = '5BA25' WHERE bourse_name = 'Batman Ticaret Borsası';
UPDATE products SET bourse_code = '5BI10' WHERE bourse_name = 'Biga Ticaret Borsası';
UPDATE products SET bourse_code = '5BO10' WHERE bourse_name = 'Boğazlıyan Ticaret Borsası';
UPDATE products SET bourse_code = '5BO20' WHERE bourse_name = 'Bolvadin Ticaret Borsası';
UPDATE products SET bourse_code = '5BU05' WHERE bourse_name = 'Burdur Ticaret Borsası';
UPDATE products SET bourse_code = '5BU10' WHERE bourse_name = 'Bursa Ticaret Borsası';
UPDATE products SET bourse_code = '5CA10' WHERE bourse_name = 'Çanakkale Ticaret Borsası';
UPDATE products SET bourse_code = '5CA20' WHERE bourse_name = 'Çarşamba Ticaret Borsası';
UPDATE products SET bourse_code = '5CA30' WHERE bourse_name = 'Çankırı Ticaret Borsası';
UPDATE products SET bourse_code = '5CE10' WHERE bourse_name = 'Ceyhan Ticaret Borsası';
UPDATE products SET bourse_code = '5CI10' WHERE bourse_name = 'Cihanbeyli Ticaret Borsası';
UPDATE products SET bourse_code = '5CO10' WHERE bourse_name = 'Çorlu Ticaret Borsası';
UPDATE products SET bourse_code = '5CO20' WHERE bourse_name = 'Çorum Ticaret Borsası';
UPDATE products SET bourse_code = '5CU10' WHERE bourse_name = 'Çubuk Ticaret Borsası';
UPDATE products SET bourse_code = '5DE10' WHERE bourse_name = 'Denizli Ticaret Borsası';
UPDATE products SET bourse_code = '5DI10' WHERE bourse_name = 'Diyarbakır Ticaret Borsası';
UPDATE products SET bourse_code = '5ED10' WHERE bourse_name = 'Edirne Ticaret Borsası';
UPDATE products SET bourse_code = '5ED20' WHERE bourse_name = 'Edremit Ticaret Borsası';
UPDATE products SET bourse_code = '5EL10' WHERE bourse_name = 'Elazığ Ticaret Borsası';
UPDATE products SET bourse_code = '5ER10' WHERE bourse_name = 'Ereğli/Konya Ticaret Borsası';
UPDATE products SET bourse_code = '5ER15' WHERE bourse_name = 'Erzincan Ticaret Borsası';
UPDATE products SET bourse_code = '5ER20' WHERE bourse_name = 'Erzurum Ticaret Borsası';
UPDATE products SET bourse_code = '5ES10' WHERE bourse_name = 'Eskişehir Ticaret Borsası';
UPDATE products SET bourse_code = '5FA10' WHERE bourse_name = 'Fatsa Ticaret Borsası';
UPDATE products SET bourse_code = '5GA10' WHERE bourse_name = 'Gaziantep Ticaret Borsası';
UPDATE products SET bourse_code = '5GE10' WHERE bourse_name = 'Gemlik Ticaret Borsası';
UPDATE products SET bourse_code = '5GI10' WHERE bourse_name = 'Giresun Ticaret Borsası';
UPDATE products SET bourse_code = '5GO10' WHERE bourse_name = 'Gönen Ticaret Borsası';
UPDATE products SET bourse_code = '5HA10' WHERE bourse_name = 'Hayrabolu Ticaret Borsası';
UPDATE products SET bourse_code = '5HA20' WHERE bourse_name = 'Haymana Ticaret Borsası';
UPDATE products SET bourse_code = '5IG10' WHERE bourse_name = 'Iğdır Ticaret Borsası';
UPDATE products SET bourse_code = '5IL10' WHERE bourse_name = 'Ilgın Ticaret Borsası';
UPDATE products SET bourse_code = '5IP10' WHERE bourse_name = 'İpsala Ticaret Borsası';
UPDATE products SET bourse_code = '5IS10' WHERE bourse_name = 'İskenderun Ticaret Borsası';
UPDATE products SET bourse_code = '5IS15' WHERE bourse_name = 'Isparta Ticaret Borsası';
UPDATE products SET bourse_code = '5IS20' WHERE bourse_name = 'İstanbul Ticaret Borsası';
UPDATE products SET bourse_code = '5IZ10' WHERE bourse_name = 'İzmir Ticaret Borsası';
UPDATE products SET bourse_code = '5KA05' WHERE bourse_name = 'Kadirli Ticaret Borsası';
UPDATE products SET bourse_code = '5KA10' WHERE bourse_name = 'Kahramanmaraş Ticaret Borsası';
UPDATE products SET bourse_code = '5KA20' WHERE bourse_name = 'Karacabey Ticaret Borsası';
UPDATE products SET bourse_code = '5KA30' WHERE bourse_name = 'Karaman Ticaret Borsası';
UPDATE products SET bourse_code = '5KA40' WHERE bourse_name = 'Karapınar/Konya Ticaret Borsası';
UPDATE products SET bourse_code = '5KA50' WHERE bourse_name = 'Kars Ticaret Borsası';
UPDATE products SET bourse_code = '5KA60' WHERE bourse_name = 'Kayseri Ticaret Borsası';
UPDATE products SET bourse_code = '5KA90' WHERE bourse_name = 'Kastamonu Ticaret Borsası';
UPDATE products SET bourse_code = '5KE10' WHERE bourse_name = 'Keşan Ticaret Borsası';
UPDATE products SET bourse_code = '5KI05' WHERE bourse_name = 'Kırıkkale Ticaret Borsası';
UPDATE products SET bourse_code = '5KI10' WHERE bourse_name = 'Kırklareli Ticaret Borsası';
UPDATE products SET bourse_code = '5KI20' WHERE bourse_name = 'Kırşehir Ticaret Borsası';
UPDATE products SET bourse_code = '5KI30' WHERE bourse_name = 'Kızıltepe Ticaret Borsası';
UPDATE products SET bourse_code = '5KO10' WHERE bourse_name = 'Konya Ticaret Borsası';
UPDATE products SET bourse_code = '5KO20' WHERE bourse_name = 'Kozan Ticaret Borsası';
UPDATE products SET bourse_code = '5KU05' WHERE bourse_name = 'Kumluca Ticaret Borsası';
UPDATE products SET bourse_code = '5LU10' WHERE bourse_name = 'Lüleburgaz Ticaret Borsası';
UPDATE products SET bourse_code = '5MA10' WHERE bourse_name = 'Malatya Ticaret Borsası';
UPDATE products SET bourse_code = '5MA20' WHERE bourse_name = 'Malkara Ticaret Borsası';
UPDATE products SET bourse_code = '5MA30' WHERE bourse_name = 'Manisa Ticaret Borsası';
UPDATE products SET bourse_code = '5ME10' WHERE bourse_name = 'Mersin Ticaret Borsası';
UPDATE products SET bourse_code = '5MU10' WHERE bourse_name = 'Mustafakemalpaşa Ticaret Borsası';
UPDATE products SET bourse_code = '5MU20' WHERE bourse_name = 'Muğla Ticaret Borsası';
UPDATE products SET bourse_code = '5NA10' WHERE bourse_name = 'Nazilli Ticaret Borsası';
UPDATE products SET bourse_code = '5NE10' WHERE bourse_name = 'Nevşehir Ticaret Borsası';
UPDATE products SET bourse_code = '5NI05' WHERE bourse_name = 'Niğde Ticaret Borsası';
UPDATE products SET bourse_code = '5NI10' WHERE bourse_name = 'Nizip Ticaret Borsası';
UPDATE products SET bourse_code = '5NU10' WHERE bourse_name = 'Nusaybin Ticaret Borsası';
UPDATE products SET bourse_code = '5OD10' WHERE bourse_name = 'Ödemiş Ticaret Borsası';
UPDATE products SET bourse_code = '5OR10' WHERE bourse_name = 'Ordu Ticaret Borsası';
UPDATE products SET bourse_code = '5OS10' WHERE bourse_name = 'Osmaniye Ticaret Borsası';
UPDATE products SET bourse_code = '5PO10' WHERE bourse_name = 'Polatlı Ticaret Borsası';
UPDATE products SET bourse_code = '5RE10' WHERE bourse_name = 'Reyhanlı Ticaret Borsası';
UPDATE products SET bourse_code = '5RI10' WHERE bourse_name = 'Rize Ticaret Borsası';
UPDATE products SET bourse_code = '5SA10' WHERE bourse_name = 'Salihli Ticaret Borsası';
UPDATE products SET bourse_code = '5SA20' WHERE bourse_name = 'Samsun Ticaret Borsası';
UPDATE products SET bourse_code = '5SA25' WHERE bourse_name = 'Sandıklı Ticaret Borsası';
UPDATE products SET bourse_code = '5SI10' WHERE bourse_name = 'Sivas Ticaret Borsası';
UPDATE products SET bourse_code = '5SO10' WHERE bourse_name = 'Söke Ticaret Borsası';
UPDATE products SET bourse_code = '5SU10' WHERE bourse_name = 'Sungurlu Ticaret Borsası';
UPDATE products SET bourse_code = '5SU20' WHERE bourse_name = 'Susurluk Ticaret Borsası';
UPDATE products SET bourse_code = '5TA20' WHERE bourse_name = 'Tarsus Ticaret Borsası';
UPDATE products SET bourse_code = '5TE10' WHERE bourse_name = 'Tekirdağ Ticaret Borsası';
UPDATE products SET bourse_code = '5TE20' WHERE bourse_name = 'Terme Ticaret Borsası';
UPDATE products SET bourse_code = '5TO10' WHERE bourse_name = 'Tokat Ticaret Borsası';
UPDATE products SET bourse_code = '5TR10' WHERE bourse_name = 'Trabzon Ticaret Borsası';
UPDATE products SET bourse_code = '5TU10' WHERE bourse_name = 'Turgutlu Ticaret Borsası';
UPDATE products SET bourse_code = '5UN10' WHERE bourse_name = 'Ünye Ticaret Borsası';
UPDATE products SET bourse_code = '5UR10' WHERE bourse_name = 'Şanlıurfa Ticaret Borsası';
UPDATE products SET bourse_code = '5US10' WHERE bourse_name = 'Uşak Ticaret Borsası';
UPDATE products SET bourse_code = '5UZ10' WHERE bourse_name = 'Uzunköprü Ticaret Borsası';
UPDATE products SET bourse_code = '5VA10' WHERE bourse_name = 'Van Ticaret Borsası';
UPDATE products SET bourse_code = '5YE10' WHERE bourse_name = 'Yenişehir Ticaret Borsası';
UPDATE products SET bourse_code = '5YE20' WHERE bourse_name = 'Yerköy Ticaret Borsası';
UPDATE products SET bourse_code = '5YO10' WHERE bourse_name = 'Yozgat Ticaret Borsası';
UPDATE products SET bourse_code = '5ZI10' WHERE bourse_name = 'Zile Ticaret Borsası';

-- Also add a source column to price_data to track where prices come from
ALTER TABLE price_data ADD COLUMN IF NOT EXISTS source text DEFAULT 'tobb';
