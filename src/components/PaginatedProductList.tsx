import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "../pages/Index";
import { useProducts } from "../hooks/useProducts";

interface FilterState {
  category: string;
  priceRange: number[];
  sortBy: string;
}

interface PaginatedProductListProps {
  filters: FilterState;
}

const PaginatedProductList = ({ filters }: PaginatedProductListProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 25;

  const { products, loading, error } = useProducts({
    category: filters.category,
    priceRange: filters.priceRange as [number, number],
    sortBy: filters.sortBy,
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage
  });

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.category, filters.priceRange, filters.sortBy]);

  // Get total count for pagination
  useEffect(() => {
    const fetchTotalCount = async () => {
      const { supabase } = await import('@/integrations/supabase/client');
      
      let countQuery = supabase
        .from('productos')
        .select('*', { count: 'exact', head: true })
        .eq('vigencia', true);

      // Apply the same filters as the main query
      if (filters.category && filters.category !== 'all') {
        // Check if category is an ID (numeric) or name (string)
        const isNumericId = !isNaN(Number(filters.category));
        
        if (isNumericId) {
          // Filter directly by familia_id
          countQuery = countQuery.eq('familia_id', parseInt(filters.category));
        } else {
          // Get familia_id by name first, then filter by it
          const { data: familiaData } = await supabase
            .from('familias')
            .select('id')
            .eq('nombre', filters.category)
            .single();
          
          if (familiaData) {
            countQuery = countQuery.eq('familia_id', familiaData.id);
          }
        }
      }

      if (filters.priceRange) {
        countQuery = countQuery
          .gte('precio', filters.priceRange[0])
          .lte('precio', filters.priceRange[1]);
      }

      const { count } = await countQuery;
      setTotalCount(count || 0);
    };

    fetchTotalCount();
  }, [filters.category, filters.priceRange]);

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
              <Card 
                key={product.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => navigate(`/producto/${product.id}`)}
              >
                <CardContent className="p-3 sm:p-4">
                  <div className="aspect-square bg-gradient-to-br from-secondary/30 to-accent/20 rounded-lg mb-2 sm:mb-3 flex items-center justify-center relative">
                    <img 
                      src={product.image} 
                      alt={product.name}
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
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 line-clamp-2 text-sm sm:text-base">
                    {product.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2 capitalize">
                    {product.category}
                  </p>
                  <p className="text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-base sm:text-lg font-bold text-primary">
                      ${product.price.toLocaleString()}
                    </span>
                    <div className="text-xs text-muted-foreground capitalize bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                      {product.category}
                    </div>
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

export default PaginatedProductList;