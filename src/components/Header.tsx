
import { ShoppingCart, Search, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  cartItemsCount: number;
  onCartClick: () => void;
}

const Header = ({ cartItemsCount, onCartClick }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-3 py-2 rounded-lg font-bold text-xl">
              MyR
            </div>
            <span className="hidden md:block text-sm text-gray-600">
              Aseo, Perfumería & Paquetería
            </span>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#inicio" className="text-gray-700 hover:text-blue-600 transition-colors">
              Inicio
            </a>
            <a href="#tienda" className="text-gray-700 hover:text-blue-600 transition-colors">
              Tienda
            </a>
            <a href="#ofertas" className="text-gray-700 hover:text-blue-600 transition-colors">
              Ofertas
            </a>
            <a href="#contacto" className="text-gray-700 hover:text-blue-600 transition-colors">
              Contacto
            </a>
          </nav>

          {/* Search and Cart */}
          <div className="flex items-center space-x-3">
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2">
              <Search className="h-4 w-4 text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Buscar productos..."
                className="bg-transparent outline-none text-sm w-40"
              />
            </div>
            
            <Button
              variant="outline"
              size="sm"
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingCart className="h-4 w-4" />
              {cartItemsCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-yellow-400 text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                  {cartItemsCount}
                </span>
              )}
            </Button>

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
