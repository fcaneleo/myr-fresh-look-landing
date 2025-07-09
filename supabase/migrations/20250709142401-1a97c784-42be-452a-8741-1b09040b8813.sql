-- Habilitar RLS en la tabla familias
ALTER TABLE public.familias ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura pública de familias
CREATE POLICY "Allow public read access to familias" 
ON public.familias 
FOR SELECT 
USING (true);

-- Habilitar RLS en la tabla productos  
ALTER TABLE public.productos ENABLE ROW LEVEL SECURITY;

-- Crear política para permitir lectura pública de productos
CREATE POLICY "Allow public read access to productos" 
ON public.productos 
FOR SELECT 
USING (true);

-- Crear política para permitir inserción/actualización/eliminación solo a usuarios autenticados
CREATE POLICY "Allow authenticated users to manage productos" 
ON public.productos 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- Crear política para permitir inserción/actualización/eliminación solo a usuarios autenticados en familias
CREATE POLICY "Allow authenticated users to manage familias" 
ON public.familias 
FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);