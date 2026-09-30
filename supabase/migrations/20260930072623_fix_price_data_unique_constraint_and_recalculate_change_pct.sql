-- Add unique constraint on (product_id, date) so upsert works correctly
CREATE UNIQUE INDEX IF NOT EXISTS idx_price_data_product_date_unique 
ON price_data (product_id, date);

-- Recalculate all change_pct values based on actual consecutive prices
WITH ordered_prices AS (
  SELECT 
    id,
    product_id,
    price,
    date,
    LAG(price) OVER (PARTITION BY product_id ORDER BY date ASC) as prev_price
  FROM price_data
)
UPDATE price_data pd
SET change_pct = COALESCE(
  ROUND(
    ((op.price - op.prev_price) / NULLIF(op.prev_price, 0) * 100)::numeric, 
    2
  ),
  0
)
FROM ordered_prices op
WHERE pd.id = op.id
  AND op.prev_price IS NOT NULL
  AND COALESCE(pd.change_pct, 0) != COALESCE(
    ROUND(
      ((op.price - op.prev_price) / NULLIF(op.prev_price, 0) * 100)::numeric, 
      2
    ),
    0
  );

-- Set change_pct to 0 for the earliest price of each product (no previous to compare)
WITH first_prices AS (
  SELECT DISTINCT ON (product_id) id
  FROM price_data
  ORDER BY product_id, date ASC
)
UPDATE price_data pd
SET change_pct = 0
FROM first_prices fp
WHERE pd.id = fp.id AND pd.change_pct != 0;
