
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ProductCarousel from "../components/ProductCarousel";
import ProductFilters from "../components/ProductFilters";
import InfiniteProductList from "../components/InfiniteProductList";
import Footer from "../components/Footer";

const Ofertas = () => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: "all",
    priceRange: [0, 50],
    sortBy: "name"
  });

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-primary transition-colors">
            Inicio
          </Link>
          <ChevronLeft className="h-4 w-4 rotate-180" />
          <span className="font-medium text-foreground">Ofertas</span>
        </div>
      </div>

      {/* Page Title */}
      <div className="container mx-auto px-4 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          Ofertas Especiales
        </h1>
        <p className="text-muted-foreground">
          Descubre los mejores precios en productos de aseo, perfumería y paquetería
        </p>
      </div>

      {/* Featured Products Carousel */}
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Productos Destacados</h2>
        <ProductCarousel />
      </div>

      {/* Filters and Product List */}
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters 
              filters={selectedFilters}
              onFiltersChange={setSelectedFilters}
            />
          </div>
          
          {/* Product List */}
          <div className="lg:col-span-3">
            <InfiniteProductList 
              filters={selectedFilters}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Ofertas;
