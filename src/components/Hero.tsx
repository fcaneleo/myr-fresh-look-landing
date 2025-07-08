import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Truck, Shield, Clock } from "lucide-react";
import { useProducts } from "@/hooks/useProducts";

const ProductsInOffer = () => {
  const { products, loading } = useProducts({ 
    limit: 4,
    // Note: We need to update useProducts hook to support the 'oferta' filter
  });

  // For now, we'll filter for products with 'oferta' on the frontend
  // Later we should update the useProducts hook to support this filter
  const offerProducts = products.filter((product: any) => product.oferta);

  if (loading) {
    return (
      <div className="relative">
        <h3 className="text-lg font-semibold text-foreground mb-4">Productos en Oferta</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-card p-4 rounded-lg shadow-sm border animate-pulse">
              <div className="w-full h-32 bg-muted rounded mb-3"></div>
              <div className="h-4 bg-muted rounded mb-2"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (offerProducts.length === 0) {
    return (
      <div className="relative">
        <h3 className="text-lg font-semibold text-foreground mb-4">Productos en Oferta</h3>
        <div className="bg-card p-8 rounded-lg shadow-sm border text-center">
          <p className="text-muted-foreground">No hay productos en oferta disponibles en este momento.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <h3 className="text-lg font-semibold text-foreground mb-4">Productos en Oferta</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {offerProducts.slice(0, 4).map((product: any) => (
          <div key={product.id} className="bg-card p-4 rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            <div className="relative mb-3">
              <img 
                src={product.image || '/placeholder.svg'} 
                alt={product.name}
                className="w-full h-32 object-cover rounded"
              />
              <div className="absolute top-2 right-2 bg-accent text-accent-foreground text-xs font-bold px-2 py-1 rounded">
                OFERTA
              </div>
            </div>
            <h4 className="font-semibold text-foreground text-sm mb-1 line-clamp-2">{product.name}</h4>
            <p className="text-primary font-bold text-lg">${product.price?.toLocaleString()}</p>
          </div>
        ))}
      </div>
      {offerProducts.length > 4 && (
        <div className="mt-4 text-center">
          <Link to="/ofertas">
            <Button variant="outline" size="sm">
              Ver todas las ofertas
            </Button>
          </Link>
        </div>
      )}
    </div>
  );
};

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

          {/* Products in Offer */}
          <ProductsInOffer />
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