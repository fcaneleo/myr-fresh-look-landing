import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import SearchInput from "./SearchInput";
import { useCategories } from "@/hooks/useCategories";
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { categories } = useCategories();
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };
  return <header className="fixed top-0 left-0 right-0 z-50 bg-card shadow-sm border-b backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img src="/lovable-uploads/31a47a1a-2c0f-4721-9b13-40c8745b3bd2.png" alt="MyR - Tu tienda de confianza" className="h-12 w-auto rounded-full" />
            <span className="hidden md:block text-sm text-muted-foreground">Perfumería, Artículos de belleza, Capilar &amp; Aseo</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Inicio
            </Link>
            
            {/* Products Navigation Menu */}
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-foreground hover:text-primary transition-colors bg-transparent hover:bg-transparent data-[active]:bg-transparent data-[state=open]:bg-transparent">
                    Productos
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                      <Link
                        to="/productos"
                        className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      >
                        <div className="text-sm font-medium leading-none">Todos los Productos</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                          Ver todo nuestro catálogo completo
                        </p>
                      </Link>
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          to={`/productos?categoria=${category.id}`}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{category.nombre}</div>
                        </Link>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
            
            <Link to="/contacto" className="text-foreground hover:text-primary transition-colors">
              Contacto
            </Link>
          </nav>

          {/* Search & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block">
              <SearchInput />
            </div>

            <Button variant="ghost" size="sm" className="md:hidden" onClick={toggleMobileMenu} aria-label="Toggle mobile menu">
              {isMobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b shadow-lg z-40">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <Link to="/" className="block text-foreground hover:text-primary transition-colors py-2" onClick={closeMobileMenu}>
                Inicio
              </Link>
              <Link to="/productos" className="block text-foreground hover:text-primary transition-colors py-2" onClick={closeMobileMenu}>
                Productos
              </Link>
              <Link to="/contacto" className="block text-foreground hover:text-primary transition-colors py-2" onClick={closeMobileMenu}>
                Contacto
              </Link>
              
              {/* Mobile Search */}
              <div className="pt-4 border-t border-border">
                <SearchInput />
              </div>
            </nav>
          </div>}
      </div>
    </header>;
};
export default Header;