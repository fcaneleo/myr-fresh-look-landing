
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Product } from "../pages/Index";
import { useProducts } from "../hooks/useProducts";
import { useCategories } from "../hooks/useCategories";
import { formatPrice } from "@/lib/formatPrice";

const ProductGrid = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const { categories, loading: categoriesLoading } = useCategories();
  
  // Fetch products with oferta=true and apply category filter
  const { products: ofertas, loading, error } = useProducts({
    category: selectedCategory === "all" ? undefined : selectedCategory,
    oferta: true // Only show products with oferta=true
  });

  // Build categories array dynamically from database + "Todos" option
  const categoryOptions = [
    { label: "Todos", value: "all" },
    ...categories.map(cat => ({ label: cat.nombre, value: cat.nombre }))
  ];

  const getProductColor = (category: string) => {
    switch (category) {
      case "Aseo Hogar":
      case "Aseo Personal":
        return "from-blue-200 to-blue-300 text-blue-700";
      case "Belleza":
      case "Maquillaje":
      case "Maquillajes TikTok":
        return "from-pink-200 to-pink-300 text-pink-700";
      case "Cuidado Capilar":
        return "from-green-200 to-green-300 text-green-700";
      case "Cuidado Personal":
        return "from-purple-200 to-purple-300 text-purple-700";
      case "Desodorantes":
        return "from-cyan-200 to-cyan-300 text-cyan-700";
      case "Perfumería":
      case "Perfumes":
        return "from-amber-200 to-amber-300 text-amber-700";
      case "Tinturas":
        return "from-indigo-200 to-indigo-300 text-indigo-700";
      default:
        return "from-muted to-muted text-muted-foreground";
    }
  };

  return (
    <section id="tienda" className="py-16 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ofertas del mes</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestra amplia selección de productos de alta calidad para el hogar y cuidado personal
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 max-w-5xl mx-auto">
          {categoriesLoading ? (
            <div className="text-center py-4">
              <p className="text-muted-foreground">Cargando categorías...</p>
            </div>
          ) : (
            categoryOptions.map((category) => (
              <Button
                key={category.value}
                variant={selectedCategory === category.value ? "default" : "outline"}
                size="sm"
                className={`text-xs md:text-sm whitespace-nowrap ${
                  selectedCategory === category.value ? "bg-primary hover:bg-primary/80" : ""
                }`}
                onClick={() => setSelectedCategory(category.value)}
              >
                {category.label}
              </Button>
            ))
          )}
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Cargando ofertas...</p>
          </div>
        )}

        {error && (
          <div className="text-center py-8">
            <p className="text-destructive">Error al cargar productos: {error}</p>
          </div>
        )}

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {ofertas.map((product) => (
          <Card 
            key={product.id} 
            className="h-full hover:shadow-lg transition-shadow cursor-pointer"
            onClick={() => navigate(`/producto/${product.id}`)}
          >
            <CardContent className="p-4">
              <div className="aspect-square bg-gradient-to-br from-secondary/30 to-accent/20 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                {product.image && product.image !== '/placeholder.svg' ? (
                   <img 
                     src={product.image} 
                     alt={product.name}
                     className="w-full h-full object-contain bg-gray-50"
                   />
                ) : (
                  <div className={`w-full h-full bg-gradient-to-br ${getProductColor(product.category)} rounded-lg flex items-center justify-center`}>
                    <span className="font-bold text-center px-2 text-sm leading-tight">{product.name}</span>
                  </div>
                )}
                {/* Badges */}
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
              <h3 className="font-semibold text-foreground mb-1 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                {product.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
                <div className="text-xs text-muted-foreground capitalize bg-muted px-2 py-1 rounded-full">
                  {product.category}
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
