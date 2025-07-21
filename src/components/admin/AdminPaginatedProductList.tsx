import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { formatPrice } from "@/lib/formatPrice";
import { AdminProduct } from "@/hooks/useProductAdmin";

interface AdminFilterState {
  category: string;
  priceRange: number[];
  sortBy: string;
  featured: boolean;
  oferta: boolean;
  porMayor: boolean;
  searchTerm?: string;
}

interface AdminPaginatedProductListProps {
  filters: AdminFilterState;
  onEditProduct: (product: AdminProduct) => void;
  onDeleteProduct: (id: number) => void;
}

const AdminPaginatedProductList = ({ filters, onEditProduct, onDeleteProduct }: AdminPaginatedProductListProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 50;

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.category, filters.priceRange, filters.sortBy, filters.featured, filters.oferta, filters.porMayor, filters.searchTerm]);

  // Fetch products with filters
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('productos')
          .select(`
            *,
            familias!inner(nombre, descripcion)
          `)
          .eq('vigencia', true);

        // Apply search filter
        if (filters.searchTerm && filters.searchTerm.trim()) {
          const searchTerm = filters.searchTerm.toLowerCase();
          query = query.or(`descripcion.ilike.%${searchTerm}%,descripcion_larga.ilike.%${searchTerm}%`);
        }

        // Apply category filter
        if (filters.category && filters.category !== 'all') {
          const isNumericId = !isNaN(Number(filters.category));
          if (isNumericId) {
            query = query.eq('familia_id', parseInt(filters.category));
          } else {
            query = query.eq('familias.nombre', filters.category);
          }
        }

        // Apply feature filters
        if (filters.featured) {
          query = query.eq('featured', true);
        }

        if (filters.oferta) {
          query = query.eq('oferta', true);
        }

        if (filters.porMayor) {
          query = query.gt('precio_mayor', 100);
        }

        // Apply price range filter
        if (filters.priceRange && filters.priceRange.length === 2) {
          if (filters.priceRange[0] > 0) {
            query = query.gte('precio', filters.priceRange[0]);
          }
          if (filters.priceRange[1] < 55000) {
            query = query.lte('precio', filters.priceRange[1]);
          }
        }

        // Apply sorting
        switch (filters.sortBy) {
          case 'name':
            query = query.order('descripcion', { ascending: true });
            break;
          case 'price_asc':
            query = query.order('precio', { ascending: true });
            break;
          case 'price_desc':
            query = query.order('precio', { ascending: false });
            break;
          case 'newest':
            query = query.order('created_at', { ascending: false });
            break;
          case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
          default:
            query = query.order('descripcion', { ascending: true });
        }

        // Get total count for pagination
        const countQuery = supabase
          .from('productos')
          .select('id', { count: 'exact', head: true })
          .eq('vigencia', true);

        // Apply same filters for count
        let finalCountQuery = countQuery;
        if (filters.searchTerm && filters.searchTerm.trim()) {
          const searchTerm = filters.searchTerm.toLowerCase();
          finalCountQuery = finalCountQuery.or(`descripcion.ilike.%${searchTerm}%,descripcion_larga.ilike.%${searchTerm}%`);
        }
        if (filters.category && filters.category !== 'all') {
          const isNumericId = !isNaN(Number(filters.category));
          if (isNumericId) {
            finalCountQuery = finalCountQuery.eq('familia_id', parseInt(filters.category));
          }
        }
        if (filters.featured) {
          finalCountQuery = finalCountQuery.eq('featured', true);
        }
        if (filters.oferta) {
          finalCountQuery = finalCountQuery.eq('oferta', true);
        }
        if (filters.porMayor) {
          finalCountQuery = finalCountQuery.gt('precio_mayor', 100);
        }
        if (filters.priceRange && filters.priceRange.length === 2) {
          if (filters.priceRange[0] > 0) {
            finalCountQuery = finalCountQuery.gte('precio', filters.priceRange[0]);
          }
          if (filters.priceRange[1] < 55000) {
            finalCountQuery = finalCountQuery.lte('precio', filters.priceRange[1]);
          }
        }

        const { count } = await finalCountQuery;
        setTotalCount(count || 0);

        // Apply pagination
        const offset = (currentPage - 1) * itemsPerPage;
        query = query.range(offset, offset + itemsPerPage - 1);

        const { data, error: fetchError } = await query;

        if (fetchError) {
          throw fetchError;
        }

        // Transform data to AdminProduct format
        const transformedProducts: AdminProduct[] = data?.map(item => ({
          id: item.id,
          codigo: item.codigo,
          codigo_texto: item.codigo_texto,
          descripcion: item.descripcion,
          descripcion_larga: item.descripcion_larga || '',
          precio: parseFloat(item.precio.toString()),
          precio_mayor: item.precio_mayor ? parseFloat(item.precio_mayor.toString()) : null,
          costo: parseFloat(item.costo.toString()),
          costo_neto: item.costo_neto ? parseFloat(item.costo_neto.toString()) : null,
          stock: item.stock,
          stock_minimo: item.stock_minimo || 0,
          unidad_medida: item.unidad_medida,
          familia_id: item.familia_id,
          familia_nombre: item.familias?.nombre || '',
          codigo_proveedor: item.codigo_proveedor || null,
          codigo_proveedor2: item.codigo_proveedor2 || null,
          codigo_proveedor3: item.codigo_proveedor3 || null,
          cantidad_mayor: item.cantidad_mayor || null,
          ajuste: item.ajuste || 0,
          promocion: Boolean(item.promocion),
          servicio: Boolean(item.servicio),
          con_impuesto: Boolean(item.con_impuesto),
          tipo_impuesto: item.tipo_impuesto || 0,
          valor_impuesto: item.valor_impuesto ? parseFloat(item.valor_impuesto.toString()) : 0,
          featured: Boolean(item.featured),
          oferta: Boolean(item.oferta),
          vigencia: Boolean(item.vigencia),
          image_url: item.image_url || null,
          created_at: item.created_at,
          updated_at: item.updated_at
        })) || [];

        setProducts(transformedProducts);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar productos');
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [currentPage, filters]);

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <Button
          key={page}
          variant={page === currentPage ? "default" : "outline"}
          size="sm"
          onClick={() => handlePageChange(page)}
          className="min-w-[40px]"
        >
          {page}
        </Button>
      );
    }

    return buttons;
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Error al cargar productos: {error}</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Todos los Productos ({totalCount} productos)
        </h2>
        <div className="text-sm text-muted-foreground">
          Página {currentPage} de {totalPages}
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-4">Cargando productos...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
            {products.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-3 sm:p-4">
                  <div className="aspect-square bg-gradient-to-br from-secondary/30 to-accent/20 rounded-lg mb-2 sm:mb-3 flex items-center justify-center relative">
                    <img 
                      src={product.image_url || '/placeholder.svg'} 
                      alt={product.descripcion}
                      className="w-full h-full object-cover rounded-lg"
                    />
                    {/* Badges */}
                    {product.featured && (
                      <Badge className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-primary text-primary-foreground text-xs">
                        Destacado
                      </Badge>
                    )}
                    {product.oferta && (
                      <Badge className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-accent text-accent-foreground text-xs">
                        Oferta
                      </Badge>
                    )}
                    {product.precio_mayor && product.precio_mayor > 100 && (
                      <Badge className="absolute bottom-1 left-1 sm:bottom-2 sm:left-2 bg-secondary text-secondary-foreground text-xs">
                        Por Mayor
                      </Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-2 text-sm sm:text-base">
                    {product.descripcion}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2 capitalize">
                    {product.familia_nombre}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
                    {product.descripcion_larga}
                  </p>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-base sm:text-lg font-bold text-primary">
                      {formatPrice(product.precio)}
                    </span>
                    <div className="text-xs text-muted-foreground capitalize bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                      {product.familia_nombre}
                    </div>
                  </div>
                  
                  {/* Admin Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate(`/producto/${product.id}`)}
                      className="flex-1"
                    >
                      Ver
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditProduct(product)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteProduct(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {products.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No se encontraron productos con los filtros seleccionados</p>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-2 mt-6 sm:mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="w-full sm:w-auto"
              >
                <ChevronLeft className="h-4 w-4" />
                Anterior
              </Button>
              
              <div className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto max-w-full">
                {renderPaginationButtons()}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="w-full sm:w-auto"
              >
                Siguiente
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminPaginatedProductList;