
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import type { CarouselApi } from "@/components/ui/carousel";
import { useProducts } from "../hooks/useProducts";
import { formatPrice } from "@/lib/formatPrice";

const ProductCarousel = () => {
  const navigate = useNavigate();
  const [api, setApi] = React.useState<CarouselApi>();
  const { products: featuredProducts, loading } = useProducts({ 
    featured: true, 
    limit: 8 
  });

  useEffect(() => {
    if (!api) {
      return;
    }

    const interval = setInterval(() => {
      api.scrollNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [api]);

  if (loading) {
    return (
      <div className="w-full flex justify-center py-8">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Carousel
      setApi={setApi}
      opts={{
        align: "start",
        loop: true,
      }}
      className="w-full"
    >
      <CarouselContent className="-ml-2 md:-ml-4">
        {featuredProducts.map((product) => (
          <CarouselItem key={product.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
            <Card 
              className="h-full hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => navigate(`/producto/${product.id}`)}
            >
              <CardContent className="p-4">
                 <div className="aspect-square bg-gradient-to-br from-secondary/30 to-accent/20 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
                   <img 
                     src={product.image} 
                     alt={product.name}
                     className="w-full h-full object-cover"
                   />
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
                  <div className="flex flex-col">
                     <span className="text-lg font-bold text-primary">
                       {formatPrice(product.price)}
                     </span>
                     <span className="text-xs text-muted-foreground line-through">
                       {formatPrice(product.price * 1.25)}
                     </span>
                  </div>
                  <div className="text-xs text-muted-foreground capitalize bg-muted px-2 py-1 rounded-full">
                    {product.category}
                  </div>
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
