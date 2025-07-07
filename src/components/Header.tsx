
import { Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-card shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-primary to-primary-glow text-primary-foreground px-3 py-2 rounded-lg font-bold text-xl">
              MyR
            </div>
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
          </nav>

          {/* Search */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center bg-muted rounded-full px-4 py-2">
              <Search className="h-4 w-4 text-muted-foreground mr-2" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="bg-transparent outline-none text-sm w-40 text-foreground placeholder:text-muted-foreground"
              />
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
