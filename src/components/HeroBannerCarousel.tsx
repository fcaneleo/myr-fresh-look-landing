import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  type CarouselApi 
} from "@/components/ui/carousel";

const HeroBannerCarousel = () => {
  const navigate = useNavigate();
  const [api, setApi] = useState<CarouselApi>();

  // Banner data with images and their corresponding routes
  const banners = [
    {
      id: 1,
      image: "/lovable-uploads/bb0976c6-155b-4c42-b2c4-7e508306628d.png",
      route: "/contacto",
      alt: "Visita nuestra tienda física"
    },
    {
      id: 2,
      image: "/lovable-uploads/5a829d32-c226-4719-aa34-59e3e9c498d8.png", 
      route: "/productos-mayor",
      alt: "Productos por mayor"
    },
    {
      id: 3,
      image: "/lovable-uploads/7b6760b4-0ea8-497d-bdf8-b997e4eaf507.png",
      route: "/productos", 
      alt: "Nuestros productos y marcas"
    }
  ];

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);

    return () => clearInterval(interval);
  }, [api]);

  const handleBannerClick = (route: string) => {
    navigate(route);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 py-6">
      <Carousel
        setApi={setApi}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent>
          {banners.map((banner) => (
            <CarouselItem key={banner.id} className="pl-0">
              <div 
                className="relative w-full cursor-pointer group overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
                onClick={() => handleBannerClick(banner.route)}
              >
                <img
                  src={banner.image}
                  alt={banner.alt}
                  className="w-full h-[250px] md:h-[350px] lg:h-[450px] object-contain group-hover:scale-[1.02] transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors duration-300" />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default HeroBannerCarousel;