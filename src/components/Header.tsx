
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SearchInput from "./SearchInput";

const Header = () => {
  return (
    <header className="bg-card shadow-sm border-b">
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

          {/* Navigation */}
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
            <Link to="/admin" className="text-foreground hover:text-primary transition-colors">
              Admin
            </Link>
          </nav>

          {/* Search */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:block">
              <SearchInput />
            </div>

            <Button variant="ghost" size="sm" className="md:hidden">
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
