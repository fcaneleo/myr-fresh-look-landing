
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card shadow-sm border-b backdrop-blur-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/lovable-uploads/c56e675a-3d2a-45d4-b9a0-af1986053f3e.png" 
              alt="MyR - Tu tienda de confianza" 
              className="h-12 w-auto"
            />
            <span className="hidden md:block text-sm text-muted-foreground">
              Aseo, Perfumería & Paquetería
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Inicio
            </Link>
            <Link to="/ofertas" className="text-foreground hover:text-primary transition-colors">
              Ofertas
            </Link>
            <Link to="/contacto" className="text-foreground hover:text-primary transition-colors">
              Contacto
            </Link>
          </nav>

          {/* Search & Mobile Menu Button */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block">
              <SearchInput />
            </div>

            <Button 
              variant="ghost" 
              size="sm" 
              className="md:hidden"
              onClick={toggleMobileMenu}
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b shadow-lg z-40">
            <nav className="container mx-auto px-4 py-4 space-y-4">
              <Link 
                to="/" 
                className="block text-foreground hover:text-primary transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Inicio
              </Link>
              <Link 
                to="/ofertas" 
                className="block text-foreground hover:text-primary transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Ofertas
              </Link>
              <Link 
                to="/contacto" 
                className="block text-foreground hover:text-primary transition-colors py-2"
                onClick={closeMobileMenu}
              >
                Contacto
              </Link>
              
              {/* Mobile Search */}
              <div className="pt-4 border-t border-border">
                <SearchInput />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
