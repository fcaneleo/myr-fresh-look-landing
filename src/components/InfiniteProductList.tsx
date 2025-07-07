
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "../pages/Index";
import { useProducts } from "../hooks/useProducts";

interface FilterState {
  category: string;
  priceRange: number[];
  sortBy: string;
}

interface InfiniteProductListProps {
  filters: FilterState;
  onAddToCart: (product: Product) => void;
}

const InfiniteProductList = ({ filters, onAddToCart }: InfiniteProductListProps) => {
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
        <h2 className="text-xl font-semibold text-gray-900">
          Todos los Productos ({allProducts.length} productos)
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {allProducts.map((product) => (
          <Card key={product.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg mb-3 flex items-center justify-center">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover rounded-lg"
                />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {product.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2 capitalize">
                {product.category}
              </p>
              <p className="text-xs text-gray-500 mb-3 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-blue-600">
                  ${product.price}
                </span>
                <Button
                  size="sm"
                  onClick={() => onAddToCart(product)}
                  className="bg-yellow-400 hover:bg-yellow-500 text-black"
                >
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Agregar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
          <p className="text-gray-600 mt-2">Cargando más productos...</p>
        </div>
      )}

      {!hasMore && allProducts.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">Has visto todos los productos disponibles</p>
        </div>
      )}

      {allProducts.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">No se encontraron productos con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteProductList;
