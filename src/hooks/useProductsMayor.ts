import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface ProductMayor {
  id: number;
  Descripcion: string;
  descripcion_larga?: string | null;
  Precio_Mayor: number;
  categoria_nombre: string;
  image_url?: string;
  featured?: boolean;
  oferta?: boolean;
  vigencia?: boolean;
}

interface UseProductsMayorOptions {
  category?: string;
  featured?: boolean;
  oferta?: boolean;
  limit?: number;
  offset?: number;
  priceRange?: number[];
  sortBy?: string;
}

export const useProductsMayor = (options: UseProductsMayorOptions = {}) => {
  const [products, setProducts] = useState<ProductMayor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  const {
    category,
    featured,
    oferta,
    limit = 20,
    offset = 0,
    priceRange = [100, 100000],
    sortBy = "Descripcion"
  } = options;

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query manually to avoid TypeScript issues
      let queryBuilder = supabase
        .from('vista_productos_completa')
        .select('*', { count: 'exact' });

      // Filter by Precio_Mayor > 100
      queryBuilder = queryBuilder.gt('Precio_Mayor', 100);
      queryBuilder = queryBuilder.not('Precio_Mayor', 'is', null);

      // Apply category filter
      if (category && category !== "all") {
        if (!isNaN(Number(category))) {
          queryBuilder = queryBuilder.eq('Categoria', Number(category));
        } else {
          queryBuilder = queryBuilder.eq('categoria_nombre', category);
        }
      }

      // Apply featured filter
      if (featured === true) {
        queryBuilder = queryBuilder.filter('featured', 'eq', true);
      }

      // Apply oferta filter  
      if (oferta === true) {
        queryBuilder = queryBuilder.filter('oferta', 'eq', true);
      }

      // Apply price range filter
      if (priceRange && priceRange.length === 2) {
        queryBuilder = queryBuilder.gte('Precio_Mayor', priceRange[0]);
        queryBuilder = queryBuilder.lte('Precio_Mayor', priceRange[1]);
      }

      // Apply sorting
      if (sortBy === "price_asc") {
        queryBuilder = queryBuilder.order('Precio_Mayor', { ascending: true });
      } else if (sortBy === "price_desc") {
        queryBuilder = queryBuilder.order('Precio_Mayor', { ascending: false });
      } else {
        queryBuilder = queryBuilder.order('Descripcion', { ascending: true });
      }

      // Apply pagination
      queryBuilder = queryBuilder.range(offset, offset + limit - 1);

      const { data, error: fetchError, count } = await queryBuilder;

      if (fetchError) {
        throw fetchError;
      }

      // Transform data
      const transformedProducts: ProductMayor[] = (data || []).map((item: any) => ({
        id: item.id,
        Descripcion: item.Descripcion || 'Sin descripción',
        descripcion_larga: item.descripcion_larga, 
        Precio_Mayor: item.Precio_Mayor || 0,
        categoria_nombre: item.categoria_nombre || 'Sin categoría',
        image_url: item.image_url,
        featured: Boolean(item.featured),
        oferta: Boolean(item.oferta),
        vigencia: item.vigencia !== false
      }));

      setProducts(transformedProducts);
      setTotalCount(count || 0);
      setHasMore((offset + limit) < (count || 0));

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar productos');
      console.error('Error fetching products for mayor:', err);
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    fetchProducts();
  };

  const loadMore = () => {
    if (hasMore && !loading) {
      fetchProducts();
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [category, featured, oferta, limit, offset, JSON.stringify(priceRange), sortBy]);

  return {
    products,
    loading,
    error,
    hasMore,
    totalCount,
    refetch,
    loadMore
  };
};