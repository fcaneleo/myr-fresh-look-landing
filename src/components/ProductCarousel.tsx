
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { ShoppingCart } from "lucide-react";
import { Product } from "../pages/Index";

interface ProductCarouselProps {
  onAddToCart: (product: Product) => void;
}

const featuredProducts: Product[] = [
  {
    id: 101,
    name: "Detergente Ariel Premium",
    price: 4.99,
    image: "/placeholder.svg",
    category: "aseo",
    description: "Detergente en polvo con tecnología avanzada"
  },
  {
    id: 102,
    name: "Perfume Giorgio Armani",
    price: 24.99,
    image: "/placeholder.svg",
    category: "perfumeria",
    description: "Fragancia masculina elegante y sofisticada"
  },
  {
    id: 103,
    name: "Shampoo Head & Shoulders",
    price: 7.99,
    image: "/placeholder.svg",
    category: "aseo",
    description: "Shampoo anticaspa con zinc pyrithione"
  },
  {
    id: 104,
    name: "Sobre Manila A4",
    price: 0.99,
    image: "/placeholder.svg",
    category: "paqueteria",
    description: "Sobre manila tamaño A4 resistente"
  },
  {
    id: 105,
    name: "Crema Nivea Original",
    price: 3.49,
    image: "/placeholder.svg",
    category: "perfumeria",
    description: "Crema hidratante para todo tipo de piel"
  }
];

const ProductCarousel = ({ onAddToCart }: ProductCarouselProps) => {
  return (
    <Carousel
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {featuredProducts.map((product) => (
          <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <Card className="h-full hover:shadow-lg transition-shadow">
              <CardContent className="p-4">
                <div className="aspect-square bg-gradient-to-br from-blue-100 to-yellow-100 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                    -20%
                  </div>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                  {product.description}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-blue-600">
                      ${product.price}
                    </span>
                    <span className="text-xs text-gray-500 line-through">
                      ${(product.price * 1.25).toFixed(2)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => onAddToCart(product)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black"
                  >
                    <ShoppingCart className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  );
};

export default ProductCarousel;
