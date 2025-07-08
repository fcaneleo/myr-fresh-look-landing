import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Truck, Shield, Clock, MapPin, Phone, Clock3 } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-secondary/20 via-background to-accent/10 py-16">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Content */}
          <div className="space-y-16 lg:pt-4">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground leading-tight text-center mb-8">
              PRODUCTOS DE
              <br />
              <span className="text-primary">CALIDAD</span>
            </h1>
            
            {/* Logo completo */}
            <div className="flex justify-center my-8">
              <img src="/lovable-uploads/4c58c728-7ddd-449a-b4f9-e16c5e043918.png" alt="MyR - Tu tienda de confianza, Peñaflor Chile" className="w-48 md:w-64 h-auto" />
            </div>
            
            <p className="text-muted-foreground max-w-md mx-auto text-center px-4 mb-8">
              Encuentra todo lo que necesitas en aseo, perfumería y paquetería. 
              Productos de calidad con entrega rápida a tu hogar.
            </p>
            
            <div className="flex justify-center">
              <Link to="/ofertas">
                <Button className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold rounded-lg py-3 px-8">
                  VER OFERTAS
                </Button>
              </Link>
            </div>
          </div>

          {/* Nuestra Tienda */}
          <div className="relative">
            <h3 className="text-lg font-semibold text-foreground mb-4">Nuestra Tienda</h3>
            <div className="bg-card p-6 rounded-lg shadow-sm border">
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Dirección</h4>
                    <p className="text-muted-foreground">Peñaflor, cerca de la plaza principal</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock3 className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Horarios</h4>
                    <p className="text-muted-foreground">Lunes a Viernes: 9:00 - 19:00</p>
                    <p className="text-muted-foreground">Sábados: 9:00 - 18:00</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground">Contacto</h4>
                    <p className="text-muted-foreground">WhatsApp: +56 9 1234 5678</p>
                    <p className="text-muted-foreground">Teléfono: (2) 2345 6789</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-6 pt-4 border-t">
                <div className="aspect-video w-full bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-muted-foreground text-sm">Mapa de ubicación</p>
                </div>
              </div>
            </div>
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