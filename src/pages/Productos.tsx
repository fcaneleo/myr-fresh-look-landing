import { useState, useEffect, useMemo } from "react";
import { ChevronLeft, Search } from "lucide-react"; // 👈 Agregar Search
import { Link, useSearchParams } from "react-router-dom";
import { Input } from "@/components/ui/input"; // 👈 Agregar Input
import { useCategories } from "@/hooks/useCategories";
import { useProducts } from "@/hooks/useProducts";
import Header from "../components/Header";
import ProductCarousel from "../components/ProductCarousel";
import ProductFilters from "../components/ProductFilters";
import PaginatedProductList from "../components/PaginatedProductList";
import Footer from "../components/Footer";

const Productos = () => {
  const [searchParams] = useSearchParams();
  const { categories } = useCategories();
  const categoriaId = searchParams.get('categoria');
  
  // 👇 AGREGAR ESTADO PARA BÚSQUEDA (igual que en admin)
  const [searchTerm, setSearchTerm] = useState("");
  
  const [selectedFilters, setSelectedFilters] = useState({
    category: categoriaId || "all",
    priceRange: [0, 55000],
    sortBy: "name"
  });

  // Obtener todos los productos para filtrar localmente
  const { products, loading } = useProducts({
    category: "all", // Traer todos para filtrar localmente
    limit: 5000 // Traer muchos productos
  });

  // Update filters when URL parameter changes
  useEffect(() => {
    setSelectedFilters(prev => ({
      ...prev,
      category: categoriaId || "all"
    }));
  }, [categoriaId]);

  // 👇 LÓGICA DE FILTRADO LOCAL (igual que en admin)
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Filtrar por búsqueda (igual que en admin)
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(term) ||
        product.description?.toLowerCase().includes(term) ||
        product.category.toLowerCase().includes(term)
      );
    }
    
    // Filtrar por categoría
    if (selectedFilters.category && selectedFilters.category !== "all") {
      const isNumericId = !isNaN(Number(selectedFilters.category));
      if (isNumericId) {
        const categoryName = categories.find(cat => cat.id.toString() === selectedFilters.category)?.nombre;
        if (categoryName) {
          filtered = filtered.filter(product => product.category === categoryName);
        }
      } else {
        filtered = filtered.filter(product => product.category === selectedFilters.category);
      }
    }
    
    // Filtrar por rango de precios
    if (selectedFilters.priceRange) {
      filtered = filtered.filter(product => 
        product.price >= selectedFilters.priceRange[0] && 
        product.price <= selectedFilters.priceRange[1]
      );
    }
    
    // Ordenar
    switch (selectedFilters.sortBy) {
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price-asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      default:
        break;
    }
    
    return filtered;
  }, [products, searchTerm, selectedFilters, categories]);

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
            ? `Explora nuestra selección de productos de ${currentCategory.nombre.toLowerCase()}`
            : "Explora nuestra amplia gama de productos de perfumería, belleza y cuidado personal"
          }
        </p>
      </div>

      {/* 👇 SEARCH BAR (exactamente igual que en admin) */}
      <div className="container mx-auto px-4 mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar productos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 border-primary focus:border-primary ring-primary"
          />
        </div>
        {(searchTerm || selectedFilters.category !== "all") && (
          <p className="text-sm text-muted-foreground mt-2">
            Mostrando {filteredProducts.length} de {products.length} productos
          </p>
        )}
      </div>

      {/* Featured Products Carousel */}
      <div className="container mx-auto px-4 mb-8 lg:mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Productos Destacados</h2>
        <ProductCarousel />
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
            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                <p className="text-muted-foreground mt-4">Cargando productos...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">
                  {searchTerm 
                    ? `No se encontraron productos que coincidan con "${searchTerm}"`
                    : "No se encontraron productos con los filtros seleccionados"
                  }
                </p>
              </div>
            ) : (
              // 👇 RENDERIZAR PRODUCTOS FILTRADOS DIRECTAMENTE
              <div className="space-y-6">
                {/* Results info */}
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">
                    Productos ({filteredProducts.length})
                  </h2>
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <div 
                      key={product.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer border rounded-lg overflow-hidden"
                      onClick={() => window.location.href = `/producto/${product.id}`}
                    >
                      <div className="aspect-square bg-gradient-to-br from-secondary/30 to-accent/20 rounded-lg mb-2 sm:mb-3 flex items-center justify-center relative">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                        {/* Badges */}
                        {product.featured && (
                          <div className="absolute top-1 left-1 sm:top-2 sm:left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded">
                            Destacado
                          </div>
                        )}
                        {product.oferta && (
                          <div className="absolute top-1 right-1 sm:top-2 sm:right-2 bg-accent text-accent-foreground text-xs px-2 py-1 rounded">
                            Oferta
                          </div>
                        )}
                      </div>
                      
                      <div className="p-3 sm:p-4">
                        <h3 className="font-semibold text-foreground mb-1 line-clamp-2 text-sm sm:text-base">
                          {product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2 capitalize">
                          {product.category}
                        </p>
                        <p className="text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-base sm:text-lg font-bold text-primary">
                            ${product.price?.toLocaleString()}
                          </span>
                          <div className="text-xs text-muted-foreground capitalize bg-muted px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-full">
                            {product.category}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
};

export default Productos;