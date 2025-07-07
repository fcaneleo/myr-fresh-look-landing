-- Update RLS policy to allow public insert, update and delete for products table
-- This is needed for the admin panel to work without authentication

-- Drop the existing restrictive policy
DROP POLICY "Allow authenticated users to manage products" ON products;

-- Create new policies for public access to manage products
CREATE POLICY "Allow public insert access" 
ON products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public update access" 
ON products 
FOR UPDATE 
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow public delete access" 
ON products 
FOR DELETE 
USING (true);