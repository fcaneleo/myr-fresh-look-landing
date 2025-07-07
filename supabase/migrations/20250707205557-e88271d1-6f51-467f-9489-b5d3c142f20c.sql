-- Create products table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('aseo', 'perfumeria', 'paqueteria')),
  image_url TEXT,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access
CREATE POLICY "Allow public read access" ON products
  FOR SELECT TO public
  USING (true);

-- Create policy to allow authenticated users to insert/update
CREATE POLICY "Allow authenticated users to manage products" ON products
  FOR ALL TO authenticated
  USING (true);

-- Create indexes for better performance
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured);
CREATE INDEX idx_products_price ON products(price);

-- Insert sample data
INSERT INTO products (name, description, price, category, featured, image_url) VALUES
('Detergente Ariel Premium', 'Detergente en polvo con tecnología avanzada para ropa blanca y de color', 4.99, 'aseo', true, null),
('Perfume Giorgio Armani', 'Fragancia masculina elegante y sofisticada con notas amaderadas', 24.99, 'perfumeria', true, null),
('Shampoo Head & Shoulders', 'Shampoo anticaspa con zinc pyrithione, elimina la caspa desde la primera aplicación', 7.99, 'aseo', true, null),
('Sobre Manila A4', 'Sobre manila tamaño A4 resistente, ideal para documentos importantes', 0.99, 'paqueteria', true, null),
('Crema Nivea Original', 'Crema hidratante para todo tipo de piel, fórmula clásica y efectiva', 3.49, 'perfumeria', true, null),
('Jabón Dove Beauty Bar', 'Jabón de tocador con 1/4 de crema hidratante', 2.99, 'aseo', false, null),
('Perfume Chanel No. 5', 'Icónica fragancia femenina con notas florales', 89.99, 'perfumeria', false, null),
('Papel Bond A4', 'Resma de papel bond A4 de 75gr, 500 hojas', 5.99, 'paqueteria', false, null),
('Champú Pantene Pro-V', 'Champú reparador para cabello dañado', 6.49, 'aseo', false, null),
('Loción L\'Oréal Paris', 'Loción corporal hidratante con vitamina E', 8.99, 'perfumeria', false, null);