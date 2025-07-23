
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Product } from "../pages/Index";
import { useProducts } from "../hooks/useProducts";
import { formatPrice } from "@/lib/formatPrice";

interface FilterState {
  category: string;
  priceRange: number[];
  sortBy: string;
}

interface InfiniteProductListProps {
  filters: FilterState;
}

const InfiniteProductList = ({ filters }: InfiniteProductListProps) => {
  const navigate = useNavigate();
  const [offset, setOffset] = useState(0);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const { products, loading, hasMore, loadMore } = useProducts({
    category: filters.category,
    priceRange: filters.priceRange as [number, number],
    sortBy: filters.sortBy,
    featured: false,
    limit: 12,
    offset: offset
  });

  // Reset products when filters change
  useEffect(() => {
    setOffset(0);
    setAllProducts([]);
  }, [filters.category, filters.priceRange, filters.sortBy]);

  // Update products when new ones are loaded
  useEffect(() => {
    if (offset === 0) {
      setAllProducts(products);
    } else {
      setAllProducts(prev => [...prev, ...products]);
    }
  }, [products, offset]);

  // Infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000 &&
        !loading &&
        hasMore
      ) {
        setOffset(prev => prev + 12);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">
          Todos los Productos ({allProducts.length} productos)
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
        {allProducts.map((product) => (
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

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
          <p className="text-muted-foreground mt-2">Cargando más productos...</p>
        </div>
      )}

      {!hasMore && allProducts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Has visto todos los productos disponibles</p>
        </div>
      )}

      {allProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No se encontraron productos con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteProductList;
