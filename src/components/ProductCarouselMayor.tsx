import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useProductsMayor } from "@/hooks/useProductsMayor";
import { formatPrice } from "@/lib/formatPrice";

const ProductCarouselMayor = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Fetch featured products for mayor with precio_mayor > 100
  const { products: featuredProducts, loading } = useProductsMayor({
    featured: true,
    limit: 8
  });

  const [visibleItems, setVisibleItems] = useState(4);

  useEffect(() => {
    const updateVisibleItems = () => {
      if (window.innerWidth < 640) {
        setVisibleItems(1);
      } else if (window.innerWidth < 768) {
        setVisibleItems(2);
      } else if (window.innerWidth < 1024) {
        setVisibleItems(3);
      } else {
        setVisibleItems(4);
      }
    };

    updateVisibleItems();
    window.addEventListener('resize', updateVisibleItems);
    return () => window.removeEventListener('resize', updateVisibleItems);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex + visibleItems >= featuredProducts.length ? 0 : prevIndex + visibleItems
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? Math.max(0, featuredProducts.length - visibleItems) : Math.max(0, prevIndex - visibleItems)
    );
  };

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

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 animate-pulse"></div>
          <div className="flex space-x-2">
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 w-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: visibleItems }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="h-48 bg-gray-200 animate-pulse"></div>
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-6 bg-gray-200 rounded w-20 animate-pulse"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (featuredProducts.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No hay productos destacados por mayor disponibles.</p>
      </div>
    );
  }

  const visibleProducts = featuredProducts.slice(currentIndex, currentIndex + visibleItems);

  return (
    <div className="relative">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-foreground">Productos Destacados por Mayor</h3>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={prevSlide}
            disabled={currentIndex === 0}
            className="h-10 w-10 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={nextSlide}
            disabled={currentIndex + visibleItems >= featuredProducts.length}
            className="h-10 w-10 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {visibleProducts.map((product) => (
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
                <Badge className="absolute top-2 left-2 bg-yellow-500 hover:bg-yellow-600 text-white">
                  Por Mayor
                </Badge>
                {product.oferta && (
                  <Badge className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white">
                    Oferta
                  </Badge>
                )}
              </div>
              
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  <h4 className="font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                    {product.descripcion}
                  </h4>
                  
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getProductColor(product.categoria_nombre)}`}
                  >
                    {product.categoria_nombre}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-xl font-bold text-primary">
                      {formatPrice(product.precio_mayor)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Precio por mayor
                    </div>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleProductClick(product.id);
                    }}
                  >
                    Ver detalles
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      
      {featuredProducts.length > visibleItems && (
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: Math.ceil(featuredProducts.length / visibleItems) }).map((_, index) => (
            <button
              key={index}
              className={`w-2 h-2 rounded-full transition-colors ${
                Math.floor(currentIndex / visibleItems) === index 
                  ? 'bg-primary' 
                  : 'bg-gray-300'
              }`}
              onClick={() => setCurrentIndex(index * visibleItems)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCarouselMayor;