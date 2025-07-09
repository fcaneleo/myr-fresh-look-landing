-- Update RLS policies for productos table to allow public write access for admin operations
DROP POLICY IF EXISTS "Allow authenticated users to manage productos" ON public.productos;

-- Create new policies that allow both authenticated and public access for all operations
-- This is needed for the admin panel to work properly
CREATE POLICY "Allow public access to manage productos" 
ON public.productos 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- Update familias table policies similarly
DROP POLICY IF EXISTS "Allow authenticated users to manage familias" ON public.familias;

CREATE POLICY "Allow public access to manage familias" 
ON public.familias 
FOR ALL 
USING (true) 
WITH CHECK (true);