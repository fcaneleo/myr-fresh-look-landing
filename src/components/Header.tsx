import { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import SearchInput from "./SearchInput";
import { useCategories } from "@/hooks/useCategories";
const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const {
    categories
  } = useCategories();
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
            <Link to="/" className="flex items-center space-x-2">
              <img src="/lovable-uploads/a930b442-6baa-492c-85a0-2afe4e300666.png" alt="R&M - Tu tienda de confianza" className="h-12 w-auto rounded-full" />
              <div className="flex flex-col">
                <span className="hidden md:block text-sm text-muted-foreground">Perfumería, Belleza, Cuidado Capilar & Más</span>
                <span className="block md:hidden text-xs text-muted-foreground leading-tight max-w-[120px] truncate">Perfumería, Belleza, Cuidado Capilar & Más</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <Link to="/" className="text-foreground hover:text-primary transition-colors">
              Inicio
            </Link>
            
            {/* Products Dropdown Menu */}
            <DropdownMenu modal={false}>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground hover:text-primary transition-colors bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent focus:outline-none focus:ring-0 h-10 px-3 flex items-center justify-center min-w-fit">
                  Productos
                  <ChevronDown className="ml-1 h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 z-[9999]" align="start" side="bottom" sideOffset={8} avoidCollisions={true} collisionPadding={16}>
                <DropdownMenuItem asChild>
                  <Link to="/productos" className="w-full cursor-pointer">
                    Todos los Productos
                  </Link>
                </DropdownMenuItem>
                {categories.map(category => <DropdownMenuItem key={category.id} asChild>
                    <Link to={`/productos?categoria=${category.id}`} className="w-full cursor-pointer">
                      {category.nombre}
                    </Link>
                  </DropdownMenuItem>)}
              </DropdownMenuContent>
            </DropdownMenu>
            
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
              
              {/* Mobile Products Dropdown */}
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="w-full justify-between text-foreground hover:text-primary transition-colors bg-transparent hover:bg-transparent focus:bg-transparent data-[state=open]:bg-transparent focus:outline-none focus:ring-0 h-10 p-2">
                    Productos
                    <ChevronDown className="h-4 w-4 transition-transform data-[state=open]:rotate-180" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[calc(100vw-2rem)] z-[9999]" align="start" side="bottom" sideOffset={8} avoidCollisions={true} collisionPadding={16}>
                  <DropdownMenuItem asChild>
                    <Link to="/productos" className="w-full cursor-pointer" onClick={closeMobileMenu}>
                      Todos los Productos
                    </Link>
                  </DropdownMenuItem>
                  {categories.map(category => <DropdownMenuItem key={category.id} asChild>
                      <Link to={`/productos?categoria=${category.id}`} className="w-full cursor-pointer" onClick={closeMobileMenu}>
                        {category.nombre}
                      </Link>
                    </DropdownMenuItem>)}
                </DropdownMenuContent>
              </DropdownMenu>
              
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