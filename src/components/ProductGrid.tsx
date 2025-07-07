
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Product } from "../pages/Index";

interface ProductGridProps {
  onAddToCart: (product: Product) => void;
}

const ProductGrid = ({ onAddToCart }: ProductGridProps) => {
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
        return "from-blue-200 to-blue-300 text-blue-700";
      case "Perfumería":
        return "from-purple-200 to-purple-300 text-purple-700";
      case "Paquetería":
        return "from-green-200 to-green-300 text-green-700";
      default:
        return "from-gray-200 to-gray-300 text-gray-700";
    }
  };

  return (
    <section id="tienda" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Nuestra Tienda</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Descubre nuestra amplia selección de productos de alta calidad para el hogar y cuidado personal
          </p>
        </div>

        {/* Categories Filter */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "Todos" ? "default" : "outline"}
              className={category === "Todos" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4">
              {/* Product Image Placeholder */}
              <div className={`h-40 bg-gradient-to-br ${getProductColor(product.category)} rounded-lg mb-4 flex items-center justify-center`}>
                <span className="font-bold text-center px-2">{product.name}</span>
              </div>
              
              {/* Product Info */}
              <div className="space-y-2">
                <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-full">
                  {product.category}
                </span>
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.description}</p>
                <div className="flex items-center justify-between pt-2">
                  <span className="text-xl font-bold text-blue-600">${product.price}</span>
                  <Button
                    size="sm"
                    onClick={() => onAddToCart(product)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Agregar
                  </Button>
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
