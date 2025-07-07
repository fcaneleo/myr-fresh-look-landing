
import { Button } from "@/components/ui/button";
import { Truck, Shield, Clock } from "lucide-react";

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-blue-50 via-white to-yellow-50 py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight">
              PRODUCTOS DE
              <br />
              <span className="text-blue-600">CALIDAD</span>
            </h1>
            <p className="text-xl text-gray-600">
              ENTREGA A DOMICILIO
            </p>
            <p className="text-gray-600 max-w-md">
              Encuentra todo lo que necesitas en aseo, perfumería y paquetería. 
              Productos de calidad con entrega rápida a tu hogar.
            </p>
            <Button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-8 py-3 rounded-lg">
              VER OFERTAS
            </Button>
          </div>

          {/* Featured Products */}
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="h-32 bg-gradient-to-br from-orange-200 to-orange-300 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-orange-700 font-bold">Detergente</span>
                </div>
                <p className="text-sm font-medium">Ariel</p>
                <p className="text-blue-600 font-bold">$4.99</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="h-32 bg-gradient-to-br from-green-200 to-green-300 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-green-700 font-bold">Suavizante</span>
                </div>
                <p className="text-sm font-medium">Downy</p>
                <p className="text-blue-600 font-bold">$3.49</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="h-32 bg-gradient-to-br from-blue-200 to-blue-300 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-blue-700 font-bold">Shampoo</span>
                </div>
                <p className="text-sm font-medium">Head & Shoulders</p>
                <p className="text-blue-600 font-bold">$5.99</p>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <div className="h-32 bg-gradient-to-br from-purple-200 to-purple-300 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-purple-700 font-bold">Perfume</span>
                </div>
                <p className="text-sm font-medium">Giorgio</p>
                <p className="text-blue-600 font-bold">$12.99</p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Truck className="h-8 w-8 text-yellow-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Entrega Rápida</h3>
            <p className="text-gray-600 text-sm">Recibe tus productos en menos de 24 horas</p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Productos Originales</h3>
            <p className="text-gray-600 text-sm">Garantizamos la autenticidad de todos nuestros productos</p>
          </div>
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Atención 24/7</h3>
            <p className="text-gray-600 text-sm">Estamos aquí para ayudarte cuando lo necesites</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
