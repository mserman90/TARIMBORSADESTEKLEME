/*
# Add tobb_product_name and last_scraped columns

1. Modified Tables
- `products`: adds `tobb_product_name` text column to store the exact product name as it appears on TOBB
  (e.g., "BUĞDAY ANADOLU KIRMIZI SERT (1.DERECE)")
- `products`: adds `last_scraped_at` timestamptz column to track when prices were last fetched
2. Notes
- tobb_product_name allows fuzzy matching between our product names and TOBB's exact names
- last_scraped_at helps the UI show when data was last refreshed
*/

ALTER TABLE products ADD COLUMN IF NOT EXISTS tobb_product_name text;
ALTER TABLE products ADD COLUMN IF NOT EXISTS last_scraped_at timestamptz;
