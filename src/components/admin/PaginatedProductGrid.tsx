import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AdminProduct } from "@/hooks/useProductAdmin";
import { ProductCard } from "./ProductCard";

interface PaginatedProductGridProps {
  products: AdminProduct[];
  onEditProduct: (product: AdminProduct) => void;
  onDeleteProduct: (id: number) => void;
}

export const PaginatedProductGrid = ({ 
  products, 
  onEditProduct, 
  onDeleteProduct 
}: PaginatedProductGridProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 50;

  const totalPages = Math.ceil(products.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentProducts = products.slice(startIndex, endIndex);

  // Reset to first page when products change
  useEffect(() => {
    setCurrentPage(1);
  }, [products.length]);

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

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No hay productos registrados</p>
        <p className="text-muted-foreground">Crea tu primer producto usando el botón "Nuevo Producto"</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 gap-2 sm:gap-0">
        <h2 className="text-lg sm:text-xl font-semibold text-foreground">
          Productos ({products.length} total)
        </h2>
        <div className="text-sm text-muted-foreground">
          Mostrando {startIndex + 1}-{Math.min(endIndex, products.length)} de {products.length} productos
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEditProduct}
            onDelete={onDeleteProduct}
          />
        ))}
      </div>

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
    </div>
  );
};