
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Product } from "../pages/Index";

const ProductGrid = () => {
  const navigate = useNavigate();
  const products: Product[] = [
    { id: 1, name: "Ariel Detergente", price: 4.99, image: "", category: "Aseo", description: "Detergente en polvo para ropa" },
    { id: 2, name: "Downy Suavizante", price: 3.49, image: "", category: "Aseo", description: "Suavizante de telas" },
    { id: 3, name: "Head & Shoulders", price: 5.99, image: "", category: "Perfumería", description: "Shampoo anticaspa" },
    { id: 4, name: "Colgate Total", price: 2.99, image: "", category: "Aseo", description: "Pasta dental" },
    { id: 5, name: "Axe Desodorante", price: 4.49, image: "", category: "Perfumería", description: "Desodorante en spray" },
    { id: 6, name: "Gillette Fusion", price: 8.99, image: "", category: "Aseo", description: "Maquinilla de afeitar" },
    { id: 7, name: "L'Oréal Paris", price: 15.99, image: "", category: "Perfumería", description: "Perfume para mujer" },
    { id: 8, name: "Pampers", price: 12.99, image: "", category: "Paquetería", description: "Pañales para bebé" },
    { id: 9, name: "Kleenex", price: 3.99, image: "", category: "Paquetería", description: "Pañuelos desechables" },
    { id: 10, name: "Always", price: 6.99, image: "", category: "Paquetería", description: "Toallas femeninas" },
    { id: 11, name: "Oral-B", price: 3.99, image: "", category: "Aseo", description: "Cepillo de dientes" },
    { id: 12, name: "Pantene", price: 7.99, image: "", category: "Perfumería", description: "Acondicionador para cabello" }
  ];

  const categories = ["Todos", "Aseo", "Perfumería", "Paquetería"];

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
          <h2 className="text-3xl font-bold text-foreground mb-4">Nuestra Tienda</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Descubre nuestra amplia selección de productos de alta calidad para el hogar y cuidado personal
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "Todos" ? "default" : "outline"}
              className={category === "Todos" ? "bg-primary hover:bg-primary/80" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
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
