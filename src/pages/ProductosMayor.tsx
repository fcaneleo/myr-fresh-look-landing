import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import Header from "../components/Header";
import ProductCarouselMayor from "../components/ProductCarouselMayor";
import ProductFilters from "../components/ProductFilters";
import PaginatedProductListMayor from "../components/PaginatedProductListMayor";
import SearchInput from "../components/SearchInput";
import Footer from "../components/Footer";

const ProductosMayor = () => {
  const [searchParams] = useSearchParams();
  const { categories } = useCategories();
  const categoriaId = searchParams.get('categoria');
  
  const [selectedFilters, setSelectedFilters] = useState({
    category: categoriaId || "all",
    priceRange: [100, 100000], // Rango para precios por mayor
    sortBy: "name"
  });

  // Update filters when URL parameter changes
  useEffect(() => {
    setSelectedFilters(prev => ({
      ...prev,
      category: categoriaId || "all"
    }));
  }, [categoriaId]);

  // Find the current category name for display
  const currentCategory = categoriaId 
    ? categories.find(cat => cat.id.toString() === categoriaId)
    : null;

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
          <span className="font-medium text-foreground">Productos por Mayor</span>
        </div>
      </div>

      {/* Page Title */}
      <div className="container mx-auto px-4 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {currentCategory ? `${currentCategory.nombre} - Por Mayor` : "Productos por Mayor"}
        </h1>
        <p className="text-muted-foreground">
          {currentCategory 
            ? `Productos de ${currentCategory.nombre} con precios especiales para compras por mayor`
            : "Productos con precios especiales para compras por mayor (mínimo 3 unidades por producto)"
          }
        </p>
      </div>

      {/* Featured Products Carousel */}
      <div className="container mx-auto px-4 mb-8 lg:mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Productos Destacados por Mayor</h2>
        <ProductCarouselMayor />
      </div>

      {/* Search Bar */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex justify-center">
          <SearchInput />
        </div>
      </div>

      {/* Mobile Filters - Show only on mobile, below featured products */}
      <div className="container mx-auto px-4 mb-6 lg:hidden">
        <ProductFilters 
          filters={selectedFilters}
          onFiltersChange={setSelectedFilters}
        />
      </div>

      {/* Filters and Product List */}
      <div className="container mx-auto px-4 pb-8">
        <div className="flex flex-col lg:grid lg:grid-cols-4 gap-6 lg:gap-8">
          {/* Desktop Filters Sidebar - Hidden on mobile */}
          <div className="hidden lg:block lg:col-span-1">
            <ProductFilters 
              filters={selectedFilters}
              onFiltersChange={setSelectedFilters}
            />
          </div>
          
          {/* Product List */}
          <div className="lg:col-span-3">
            <PaginatedProductListMayor 
              filters={selectedFilters}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default ProductosMayor;