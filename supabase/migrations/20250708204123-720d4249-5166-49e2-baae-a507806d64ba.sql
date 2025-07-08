-- Add 'oferta' column to products table
ALTER TABLE public.products 
ADD COLUMN oferta boolean DEFAULT false;