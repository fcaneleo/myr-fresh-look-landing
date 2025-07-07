
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { Product } from "../pages/Index";

interface FilterState {
  category: string;
  priceRange: number[];
  sortBy: string;
}

interface InfiniteProductListProps {
  filters: FilterState;
  onAddToCart: (product: Product) => void;
}

// Mock data for products
const generateProducts = (count: number, offset: number = 0): Product[] => {
  const categories = ["aseo", "perfumeria", "paqueteria"];
  const products = [];
  
  for (let i = 0; i < count; i++) {
    const id = offset + i + 1;
    const category = categories[Math.floor(Math.random() * categories.length)];
    const basePrice = Math.random() * 45 + 5; // 5-50 price range
    
    products.push({
      id,
      name: `Producto ${id}`,
      price: Math.round(basePrice * 100) / 100,
      image: "/placeholder.svg",
      category,
      description: `Descripción del producto ${id} de la categoría ${category}`
    });
  }
  
  return products;
};

const InfiniteProductList = ({ filters, onAddToCart }: InfiniteProductListProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadProducts = useCallback(async (pageNum: number, reset: boolean = false) => {
    setLoading(true);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newProducts = generateProducts(12, (pageNum - 1) * 12);
    
    // Apply filters
    let filteredProducts = newProducts;
    
    if (filters.category !== "all") {
      filteredProducts = filteredProducts.filter(p => p.category === filters.category);
    }
    
    filteredProducts = filteredProducts.filter(
      p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]
    );
    
    // Apply sorting
    switch (filters.sortBy) {
      case "name-desc":
        filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "price-asc":
        filteredProducts.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        filteredProducts.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        filteredProducts.sort((a, b) => b.id - a.id);
        break;
      default:
        filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
    
    if (reset) {
      setProducts(filteredProducts);
    } else {
      setProducts(prev => [...prev, ...filteredProducts]);
    }
    
    setHasMore(pageNum < 5); // Limit to 5 pages for demo
    setLoading(false);
  }, [filters]);

  // Load initial products and reset when filters change
  useEffect(() => {
    setPage(1);
    loadProducts(1, true);
  }, [filters, loadProducts]);

  // Infinite scroll logic
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop
        >= document.documentElement.offsetHeight - 1000 &&
        !loading &&
        hasMore
      ) {
        const nextPage = page + 1;
        setPage(nextPage);
        loadProducts(nextPage);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page, loading, hasMore, loadProducts]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">
          Todos los Productos ({products.length} productos)
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
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

      {!hasMore && products.length > 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">Has visto todos los productos disponibles</p>
        </div>
      )}

      {products.length === 0 && !loading && (
        <div className="text-center py-12">
          <p className="text-gray-600">No se encontraron productos con los filtros seleccionados</p>
        </div>
      )}
    </div>
  );
};

export default InfiniteProductList;
