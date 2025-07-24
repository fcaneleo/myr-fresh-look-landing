import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Product } from '@/pages/Index';

interface UseProductsOptions {
  category?: string;
  featured?: boolean;
  oferta?: boolean;
  porMayor?: boolean;
  limit?: number;
  offset?: number;
  priceRange?: [number, number];
  sortBy?: string;
  searchTerm?: string;
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
        .from('productos')
        .select(`
          *,
          familias (
            nombre
          )
        `)
        .eq('vigencia', true);

      // Apply filters  
      if (options.category && options.category !== 'all') {
        // Check if category is an ID (numeric) or name (string)
        const isNumericId = !isNaN(Number(options.category));
        
        if (isNumericId) {
          // Filter directly by Categoria
          query = query.eq('Categoria', parseInt(options.category));
        } else {
          // Get Categoria by name first, then filter by it
          const { data: familiaData } = await supabase
            .from('familias')
            .select('id')
            .eq('nombre', options.category)
            .single();
          
          if (familiaData) {
            query = query.eq('Categoria', familiaData.id);
          }
        }
      }

      if (options.featured !== undefined) {
        query = query.eq('featured', options.featured);
      }

      if (options.oferta !== undefined) {
        query = query.eq('oferta', options.oferta);
      }

      // Filter by mayor status (Precio_Mayor > 100)
      if (options.porMayor !== undefined) {
        if (options.porMayor) {
          query = query.gt('Precio_Mayor', 100);
        } else {
          query = query.or('Precio_Mayor.is.null,Precio_Mayor.lte.100');
        }
      }

      // Apply search filter
      if (options.searchTerm && options.searchTerm.trim()) {
        const searchTerm = options.searchTerm.toLowerCase();
        query = query.or(`Descripcion.ilike.%${searchTerm}%,descripcion_larga.ilike.%${searchTerm}%`);
      }

      if (options.priceRange) {
        query = query
          .gte('Precio', options.priceRange[0])
          .lte('Precio', options.priceRange[1]);
      }

      // Apply sorting
      switch (options.sortBy) {
        case 'name-desc':
          query = query.order('Descripcion', { ascending: false });
          break;
        case 'price-asc':
          query = query.order('Precio', { ascending: true });
          break;
        case 'price-desc':
          query = query.order('Precio', { ascending: false });
          break;
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        default:
          query = query.order('Descripcion', { ascending: true });
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
        name: item.Descripcion,
        price: parseFloat(item.Precio.toString()),
        image: item.image_url || '/placeholder.svg',
        category: item.familias?.nombre || '',
        description: item.descripcion_larga || '',
        featured: Boolean(item.featured),
        oferta: Boolean(item.oferta)
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
    options.oferta,
    options.porMayor,
    options.limit,
    options.offset,
    options.priceRange?.[0],
    options.priceRange?.[1],
    options.sortBy,
    options.searchTerm
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