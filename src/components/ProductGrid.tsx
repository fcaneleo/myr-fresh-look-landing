
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Product } from "../pages/Index";
import { useProducts } from "../hooks/useProducts";

const ProductGrid = () => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  // Fetch products with oferta=true and apply category filter
  const { products: ofertas, loading, error } = useProducts({
    category: selectedCategory === "all" ? undefined : selectedCategory.toLowerCase(),
    oferta: true // Only show products with oferta=true
  });

  const categories = [
    { label: "Todos", value: "all" },
    { label: "Aseo", value: "aseo" },
    { label: "Perfumería", value: "perfumeria" },
    { label: "Paquetería", value: "paqueteria" }
  ];

  const getProductColor = (category: string) => {
    switch (category) {
      case "Aseo":
        return "from-primary/20 to-primary/30 text-primary";
      case "Perfumería":
        return "from-secondary/30 to-accent/20 text-primary";
      case "Paquetería":
        return "from-accent/20 to-success/20 text-success";
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
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              className={selectedCategory === category.value ? "bg-primary hover:bg-primary/80" : ""}
              onClick={() => setSelectedCategory(category.value)}
            >
              {category.label}
            </Button>
          ))}
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
          <div 
            key={product.id} 
            className="bg-card rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 cursor-pointer"
            onClick={() => navigate(`/producto/${product.id}`)}
          >
              {/* Product Image Placeholder */}
              <div className={`h-40 bg-gradient-to-br ${getProductColor(product.category)} rounded-lg mb-4 flex items-center justify-center`}>
                <span className="font-bold text-center px-2">{product.name}</span>
              </div>
              
              {/* Product Info */}
              <div className="space-y-2">
                <span className="inline-block bg-muted text-muted-foreground text-xs px-2 py-1 rounded-full">
                  {product.category}
                </span>
                <h3 className="font-semibold text-foreground">{product.name}</h3>
                <p className="text-muted-foreground text-sm">{product.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-bold text-primary">${product.price}</span>
                  <div className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full">
                    Ver más
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
