import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Truck, Shield, Clock, MapPin, Phone, MessageCircle } from "lucide-react";
const Hero = () => {
  return <section className="bg-gradient-to-br from-secondary/20 via-background to-accent/10 py-16">
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
              <img src="/lovable-uploads/e6b57251-7b96-4b30-bc97-3e6da25c9e4b.png" alt="RyM - Tu tienda de confianza, Peñaflor Chile" className="w-54 md:w-[32rem] h-auto" />
            </div>
            
            <p className="text-muted-foreground max-w-md mx-auto text-center px-4 mb-8">
              Encuentra todo lo que necesitas en aseo, perfumería y paquetería. 
              Productos de calidad con entrega rápida a tu hogar.
            </p>
            
            <div className="flex justify-center">
              <Link to="/ofertas">
                <Button className="bg-accent hover:bg-accent/80 text-accent-foreground font-semibold rounded-lg py-3 mx-0 px-[75px]">
                  VER OFERTAS
                </Button>
              </Link>
            </div>
          </div>

          {/* Store Information & Map */}
          <div className="relative">
            <h3 className="text-lg font-semibold text-foreground mb-4">Nuestra Tienda</h3>
            
            {/* Store Info Cards */}
            <div className="grid grid-cols-1 gap-4 mb-6">
              {/* Address & Hours */}
              <div className="bg-card p-4 rounded-lg shadow-sm border">
                <div className="flex items-start space-x-3 mb-3">
                  <MapPin className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Dirección</h4>
                    <p className="text-sm text-muted-foreground">Avenida Vicuña Mackena 4015 Local E</p>
                    <p className="text-xs text-muted-foreground">Peñaflor, Región Metropolitana</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <h4 className="font-semibold text-foreground">Horarios</h4>
                    <p className="text-sm text-muted-foreground">Lun - Vie: 9:00 - 19:00</p>
                    <p className="text-sm text-muted-foreground">Sábado: 9:00 - 18:00</p>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="bg-card p-4 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <div>
                      <h4 className="font-semibold text-foreground">Contacto</h4>
                      <p className="text-sm text-muted-foreground"> +56 9 3083 7263</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-success hover:bg-success/80 text-success-foreground" onClick={() => window.open('https://wa.me/56930837263?text=Hola,%20me%20interesa%20información%20sobre%20sus%20productos', '_blank')}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </div>

            {/* Google Maps */}
            <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.1!2d-70.90341575766996!3d-33.61071501051266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM2JzM4LjYiUyA3MMKwNTQnMTIuMyJX!5e0!3m2!1ses!2scl!4v1641234567890!5m2!1ses!2scl&q=-33.61071501051266,-70.90341575766996" width="100%" height="200" style={{
              border: 0
            }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full"></iframe>
              <div className="p-3 bg-muted/50">
                <p className="text-xs text-muted-foreground text-center">
                  📍 Visítanos en el centro de Peñaflor, cerca de la plaza principal
                </p>
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
    </section>;
};
export default Hero;