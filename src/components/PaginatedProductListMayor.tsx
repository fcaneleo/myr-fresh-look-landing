import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProductsMayor } from "@/hooks/useProductsMayor";
import { formatPrice } from "@/lib/formatPrice";

interface PaginatedProductListMayorProps {
  filters: {
    category: string;
    priceRange: number[];
    sortBy: string;
  };
}

const PaginatedProductListMayor = ({ filters }: PaginatedProductListMayorProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const { 
    products, 
    loading, 
    error, 
    hasMore, 
    totalCount 
  } = useProductsMayor({
    category: filters.category === "all" ? undefined : filters.category,
    priceRange: filters.priceRange,
    sortBy: filters.sortBy,
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage
  });

  const handleProductClick = (productId: number) => {
    navigate(`/producto/${productId}?view=mayor`);
  };

  const getProductColor = (categoria: string) => {
    const colors = {
      "Perfumería": "bg-purple-100 text-purple-800 border-purple-200",
      "Belleza": "bg-pink-100 text-pink-800 border-pink-200",
      "Cuidado Capilar": "bg-blue-100 text-blue-800 border-blue-200",
      "Aseo Personal": "bg-green-100 text-green-800 border-green-200",
      "Aseo Hogar": "bg-yellow-100 text-yellow-800 border-yellow-200",
      "Desodorantes": "bg-cyan-100 text-cyan-800 border-cyan-200",
      "Maquillaje": "bg-rose-100 text-rose-800 border-rose-200",
      "Perfumes": "bg-indigo-100 text-indigo-800 border-indigo-200",
      "Tinturas": "bg-orange-100 text-orange-800 border-orange-200"
    };
    return colors[categoria as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200";
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error al cargar productos: {error}</p>
        <Button onClick={() => window.location.reload()}>
          Intentar de nuevo
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Results info */}
      <div className="flex justify-between items-center text-sm text-muted-foreground">
        <span>
          Mostrando {products.length} de {totalCount} productos por mayor
        </span>
        {totalPages > 1 && (
          <span>
            Página {currentPage} de {totalPages}
          </span>
        )}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: itemsPerPage }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <Skeleton className="h-48 w-full" />
                <div className="p-4 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-6 w-1/3" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : products.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-muted-foreground text-lg">
              No se encontraron productos por mayor que coincidan con los filtros seleccionados.
            </p>
          </div>
        ) : (
          products.map((product) => (
            <Card 
              key={product.id} 
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border hover:border-primary/20"
              onClick={() => handleProductClick(product.id)}
            >
              <CardContent className="p-0">
                <div className="relative overflow-hidden">
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.descripcion}
                    className="w-full h-48 object-contain bg-gray-50 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = "/placeholder.svg";
                    }}
                  />
                  {product.oferta && (
                    <Badge className="absolute top-2 left-2 bg-red-500 hover:bg-red-600 text-white">
                      Oferta
                    </Badge>
                  )}
                  {product.featured && (
                    <Badge className="absolute top-2 right-2 bg-yellow-500 hover:bg-yellow-600 text-white">
                      Destacado
                    </Badge>
                  )}
                </div>
                
                <div className="p-4 space-y-3">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                      {product.descripcion}
                    </h3>
                    
                    <Badge 
                      variant="outline" 
                      className="text-xs"
                    >
                      {product.categoria_nombre}
                    </Badge>
                  </div>                  
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {product.descripcion_larga}
                    </p>
                  
                  
                  <div className="flex items-center justify-between">
                    <div className="text-xl font-bold text-primary">
                      {formatPrice(product.precio_mayor)}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2 pt-6">
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
          >
            Anterior
          </Button>
          
          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
            const page = i + 1;
            if (totalPages <= 5) {
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? "default" : "outline"}
                  size="sm"
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </Button>
              );
            }
            
            // Logic for showing pages around current page
            let pageToShow = page;
            if (currentPage > 3) {
              pageToShow = currentPage - 2 + i;
            }
            if (pageToShow > totalPages) {
              pageToShow = totalPages - 4 + i;
            }
            
            return (
              <Button
                key={pageToShow}
                variant={currentPage === pageToShow ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(pageToShow)}
              >
                {pageToShow}
              </Button>
            );
          })}
          
          <Button
            variant="outline"
            size="sm"
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaginatedProductListMayor;