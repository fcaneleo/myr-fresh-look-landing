import { ChevronLeft, MapPin, Phone, Clock, MessageCircle, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Header from "../components/Header";
import Footer from "../components/Footer";
const Contacto = () => {
  return <div className="min-h-screen bg-background pt-20">
      <Header />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <ChevronLeft className="h-4 w-4 rotate-180" />
          <span className="font-medium text-foreground">Contacto</span>
        </div>
      </div>

      {/* Page Title */}
      <div className="container mx-auto px-4 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Contáctanos
        </h1>
        <p className="text-muted-foreground">
          Estamos aquí para ayudarte. Encuéntranos o comunícate con nosotros.
        </p>
      </div>

      {/* Contact Information */}
      <div className="container mx-auto px-4 pb-8">
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-6 lg:gap-12">
          {/* Contact Details */}
          <div className="space-y-4 sm:space-y-6 order-2 lg:order-1">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Información de Contacto</h2>
            
            {/* Store Name */}
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-2 sm:mb-4">RyM - Aseo, Perfumería & Paquetería</h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                Tu tienda de confianza en Peñaflor para productos de aseo, perfumería y paquetería.
              </p>
            </div>

            {/* Address */}
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <MapPin className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Dirección</h4>
                  <p className="text-sm sm:text-base text-muted-foreground">Avenida Vicuña Mackena 4015 Local E</p>
                  <p className="text-sm sm:text-base text-muted-foreground">Peñaflor, Región Metropolitana</p>
                  <p className="text-sm sm:text-base text-muted-foreground">Chile</p>
                </div>
              </div>
            </div>

            {/* Hours */}
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-primary mt-1 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-semibold text-foreground mb-2 text-sm sm:text-base">Horarios de Atención</h4>
                  <div className="space-y-1">
                    <p className="text-sm sm:text-base text-muted-foreground">Lunes a Viernes: 9:00 - 19:00</p>
                    <p className="text-sm sm:text-base text-muted-foreground">Sábado: 9:00 - 18:00</p>
                    <p className="text-sm sm:text-base text-muted-foreground">Domingo: Cerrado</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Methods */}
            <div className="bg-card p-4 sm:p-6 rounded-lg shadow-sm border">
              <h4 className="font-semibold text-foreground mb-4 text-sm sm:text-base">Contáctanos</h4>
              <div className="space-y-4">
                {/* Phone */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm sm:text-base">Teléfono</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">+56 9 3083 7263</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-success hover:bg-success/80 text-success-foreground w-full sm:w-auto" onClick={() => window.open('tel:+56930837263')}>
                    <Phone className="h-4 w-4 mr-1" />
                    Llamar
                  </Button>
                </div>

                {/* WhatsApp */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex items-center space-x-3">
                    <MessageCircle className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm sm:text-base">WhatsApp</p>
                      <p className="text-xs sm:text-sm text-muted-foreground">Atención inmediata</p>
                    </div>
                  </div>
                  <Button size="sm" className="bg-success hover:bg-success/80 text-success-foreground w-full sm:w-auto" onClick={() => window.open('https://wa.me/56930837263?text=Hola,%20me%20interesa%20información%20sobre%20sus%20productos', '_blank')}>
                    <MessageCircle className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>
                </div>

                {/* Email */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0" />
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground text-sm sm:text-base">Email</p>
                      <p className="text-xs sm:text-sm text-muted-foreground break-all">Comercialicadorarym.ltda0@gmail.com</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" className="w-full sm:w-auto" onClick={() => window.open('mailto:Comercialicadorarym.ltda0@gmail.com')}>
                    <Mail className="h-4 w-4 mr-1" />
                    Enviar Email
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Map */}
          <div className="order-1 lg:order-2">
            <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 sm:mb-6">Nuestra Ubicación</h2>
            <div className="bg-card rounded-lg shadow-sm border overflow-hidden">
              <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.1!2d-70.90341575766996!3d-33.61071501051266!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzPCsDM2JzM4LjYiUyA3MMKwNTQnMTIuMyJX!5e0!3m2!1ses!2scl!4v1641234567890!5m2!1ses!2scl&q=-33.61071501051266,-70.90341575766996" width="100%" height="300" style={{
              border: 0
            }} allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" className="w-full sm:h-[400px]" />
              <div className="p-3 sm:p-4 bg-muted/50">
                <p className="text-xs sm:text-sm text-muted-foreground text-center">
                  📍 Visítanos en el centro de Peñaflor, cerca de la plaza principal
                </p>
                <div className="flex justify-center mt-2 sm:mt-3">
                  <Button variant="outline" size="sm" className="text-xs sm:text-sm" onClick={() => window.open('https://maps.google.com/?q=-33.61071501051266,-70.90341575766996', '_blank')}>
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                    Ver en Google Maps
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </div>;
};
export default Contacto;