import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/pages/Index';

interface UseProductsOptions {
  category?: string;
  featured?: boolean;
  limit?: number;
  offset?: number;
  priceRange?: [number, number];
  sortBy?: string;
}

export const useProducts = (options: UseProductsOptions = {}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase
        .from('products')
        .select('*');

      // Apply filters
      if (options.category && options.category !== 'all') {
        query = query.eq('category', options.category);
      }

      if (options.featured !== undefined) {
        query = query.eq('featured', options.featured);
      }

      if (options.priceRange) {
        query = query
          .gte('price', options.priceRange[0])
          .lte('price', options.priceRange[1]);
      }

      // Apply sorting
      switch (options.sortBy) {
        case 'name-desc':
          query = query.order('name', { ascending: false });
          break;
        case 'price-asc':
          query = query.order('price', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('price', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('name', { ascending: true });
      }

      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }

      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        throw fetchError;
      }

      // Transform data to match Product interface
      const transformedProducts: Product[] = data?.map(item => ({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        image: item.image_url || '/placeholder.svg',
        category: item.category,
        description: item.description || ''
      })) || [];

      if (options.offset && options.offset > 0) {
        setProducts(prev => [...prev, ...transformedProducts]);
      } else {
        setProducts(transformedProducts);
      }

      // Check if there are more products
      if (options.limit && transformedProducts.length < options.limit) {
        setHasMore(false);
      } else if (transformedProducts.length === 0) {
        setHasMore(false);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [
    options.category,
    options.featured,
    options.limit,
    options.offset,
    options.priceRange?.[0],
    options.priceRange?.[1],
    options.sortBy
  ]);

  const refetch = () => {
    fetchProducts();
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      const newOptions = {
        ...options,
        offset: products.length
      };
      fetchProducts();
    }
  };

  return {
    products,
    loading,
    error,
    hasMore,
    refetch,
    loadMore
  };
};

export default useProducts;