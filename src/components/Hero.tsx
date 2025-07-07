
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Truck, Shield, Clock } from "lucide-react";
import ProductCarousel from "./ProductCarousel";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-secondary/20 via-background to-accent/10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground leading-tight">
              PRODUCTOS DE
              <br />
              <span className="text-primary">CALIDAD</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              ENTREGA A DOMICILIO
            </p>
            <p className="text-muted-foreground max-w-md">
              Encuentra todo lo que necesitas en aseo, perfumería y paquetería. 
              Productos de calidad con entrega rápida a tu hogar.
            </p>
            <Link to="/ofertas">
              <Button className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold px-8 py-3 rounded-lg">
                VER OFERTAS
              </Button>
            </Link>
          </div>

          {/* Featured Products Carousel */}
          <div className="relative">
            <h3 className="text-lg font-semibold text-foreground mb-4">Productos Destacados</h3>
            <ProductCarousel />
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-accent-foreground" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Entrega Rápida</h3>
            <p className="text-muted-foreground text-sm">Recibe tus productos en menos de 24 horas</p>
          </div>
          <div className="text-center">
            <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Productos Originales</h3>
            <p className="text-muted-foreground text-sm">Garantizamos la autenticidad de todos nuestros productos</p>
          </div>
          <div className="text-center">
            <div className="bg-success/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-success" />
            </div>
            <h3 className="font-semibold text-foreground mb-2">Atención 24/7</h3>
            <p className="text-muted-foreground text-sm">Estamos aquí para ayudarte cuando lo necesites</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
