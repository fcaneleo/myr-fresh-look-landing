import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "../pages/Index";
import { useProducts } from "../hooks/useProducts";
import { formatPrice } from "@/lib/formatPrice";

interface FilterState {
  category: string;
  priceRange: number[];
  sortBy: string;
  searchTerm?: string; // 👈 AGREGAR searchTerm
}

interface PaginatedProductListProps {
  filters: FilterState;
}

const PaginatedProductList = ({ filters }: PaginatedProductListProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const itemsPerPage = 25;

  // 👇 OBTENER TODOS LOS PRODUCTOS PARA FILTRAR LOCALMENTE
  const { products: allProducts, loading, error } = useProducts({
    category: "all", // Obtener todos para filtrar localmente
    limit: 2000 // Límite alto para obtener todos
  });

  // 👇 FILTRADO LOCAL CON BÚSQUEDA
  const filteredProducts = useMemo(() => {
    let filtered = [...allProducts];
    
    // Filtrar por búsqueda (igual que en admin)
    if (filters.searchTerm && filters.searchTerm.trim()) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por categoría
    if (filters.category && filters.category !== "all") {
      const isNumericId = !isNaN(Number(filters.category));
      if (isNumericId) {
        // Aquí necesitarías mapear el ID a nombre de categoría
        // Por ahora asumo que tienes acceso a las categorías
        filtered = filtered.filter(product => {
          // Esta lógica puede necesitar ajuste según tu estructura de datos
          return true; // Placeholder
        });
      } else {
        filtered = filtered.filter(product => product.category === filters.category);
      }
    }
    
    // Filtrar por rango de precios
    if (filters.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= filters.priceRange[0] && 
        product.price <= filters.priceRange[1]
      );
    }
    
    // Ordenar
    switch (filters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [allProducts, filters]);

  // 👇 PAGINACIÓN DE PRODUCTOS FILTRADOS
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage]);

  // Actualizar totalCount basado en productos filtrados
  useEffect(() => {
    setTotalCount(filteredProducts.length);
  }, [filteredProducts]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters.category, filters.priceRange, filters.sortBy, filters.searchTerm]);

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
          {/* 👇 MOSTRAR RESULTADOS FILTRADOS */}
          {filters.searchTerm ? (
            <>Resultados de búsqueda ({totalCount} productos)</>
          ) : (
            <>Todos los Productos ({totalCount} productos)</>
          )}
        </h2>
        {totalPages > 1 && (
          <div className="text-sm text-muted-foreground">
            Página {currentPage} de {totalPages}
          </div>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-4">Cargando productos...</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* 👇 USAR PRODUCTOS PAGINADOS EN LUGAR DE products */}
            {paginatedProducts.map((product) => (
              <Card 
                key={product.id} 
                className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-primary/20"
                onClick={() => navigate(`/producto/${product.id}`)}
              >
                <CardContent className="p-0">
                  <div className="relative overflow-hidden">
                    <img
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      className="w-full h-48 object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/placeholder.svg";
                      }}
                    />
                    {product.featured && (
                      <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">
                        Destacado
                      </Badge>
                    )}
                    {product.oferta && (
                      <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground">
                        Oferta
                      </Badge>
                    )}
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                        {product.name}
                      </h3>
                      
                      <Badge 
                        variant="outline" 
                        className="text-xs"
                      >
                        {product.category}
                      </Badge>
                    </div>
                    
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-primary">
                        {formatPrice(product.price)}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* 👇 MOSTRAR MENSAJE CUANDO NO HAY RESULTADOS */}
          {paginatedProducts.length === 0 && !loading && (
            <div className="text-center py-12">
              <p className="text-muted-foreground">
                {filters.searchTerm 
                  ? `No se encontraron productos que coincidan con "${filters.searchTerm}"`
                  : "No se encontraron productos con los filtros seleccionados"
                }
              </p>
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