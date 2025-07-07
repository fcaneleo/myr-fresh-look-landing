-- Add vigencia column for logical deletion
ALTER TABLE products 
ADD COLUMN vigencia BOOLEAN DEFAULT true;

-- Update existing products to be vigente
UPDATE products SET vigencia = true WHERE vigencia IS NULL;

-- Create index for better performance on vigencia queries
CREATE INDEX idx_products_vigencia ON products(vigencia);