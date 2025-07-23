import { useState, useEffect } from "react";
import { ChevronLeft, Search } from "lucide-react"; // 👈 Agregar Search
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input"; // 👈 Agregar Input
import { useCategories } from "@/hooks/useCategories";
import Header from "../components/Header";
import ProductCarousel from "../components/ProductCarousel";
import ProductFilters from "../components/ProductFilters";
import PaginatedProductList from "../components/PaginatedProductList";
// import SearchInput from "../components/SearchInput"; // 👈 Comentar o eliminar esta línea
import Footer from "../components/Footer";

const Productos = () => {
  const [searchParams] = useSearchParams();
  const { categories } = useCategories();
  const categoriaId = searchParams.get('categoria');
  
  const [selectedFilters, setSelectedFilters] = useState({
    category: categoriaId || "all",
    priceRange: [0, 55000],
    sortBy: "name"
  });
  
  // 👇 CAMBIAR searchQuery por searchTerm (igual que en admin)
  const [searchTerm, setSearchTerm] = useState("");

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
          <span className="font-medium text-foreground">Productos</span>
        </div>
      </div>

      {/* Page Title */}
      <div className="container mx-auto px-4 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          {currentCategory ? currentCategory.nombre : "Todos los Productos"}
        </h1>
        <p className="text-muted-foreground">
          {currentCategory 
            ? `Productos de la categoría ${currentCategory.nombre}`
            : "Explora nuestro catálogo completo de productos de aseo, perfumería y paquetería"
          }
        </p>
      </div>

      {/* Featured Products Carousel */}
      <div className="container mx-auto px-4 mb-8 lg:mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Productos Destacados</h2>
        <ProductCarousel />
      </div>

      {/* 👇 SEARCH BAR DEL ADMIN (reemplazar SearchInput) */}
      <div className="container mx-auto px-4 mb-6">
        <div className="flex justify-center">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-primary focus:border-primary ring-primary"
            />
          </div>
        </div>
        {/* 👇 CONTADOR DE RESULTADOS (igual que en admin) */}
        {searchTerm && (
          <p className="text-sm text-muted-foreground mt-2 text-center">
            Buscando: "{searchTerm}"
          </p>
        )}
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
            <PaginatedProductList 
              filters={{
                ...selectedFilters,
                searchTerm: searchTerm // 👈 PASAR searchTerm al componente
              }}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Productos;