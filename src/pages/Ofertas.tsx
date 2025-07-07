
import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import ProductCarousel from "../components/ProductCarousel";
import ProductFilters from "../components/ProductFilters";
import InfiniteProductList from "../components/InfiniteProductList";
import Cart from "../components/Cart";
import { Product, CartItem } from "./Index";

const Ofertas = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    category: "all",
    priceRange: [0, 50],
    sortBy: "name"
  });

  const addToCart = (product: Product) => {
    setCartItems(prev => {
      const existingItem = prev.find(item => item.id === product.id);
      if (existingItem) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity === 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        cartItemsCount={totalItems} 
        onCartClick={() => setIsCartOpen(true)} 
      />
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link to="/" className="hover:text-blue-600 transition-colors">
            Inicio
          </Link>
          <ChevronLeft className="h-4 w-4 rotate-180" />
          <span className="font-medium text-gray-900">Ofertas</span>
        </div>
      </div>

      {/* Page Title */}
      <div className="container mx-auto px-4 pb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Ofertas Especiales
        </h1>
        <p className="text-gray-600">
          Descubre los mejores precios en productos de aseo, perfumería y paquetería
        </p>
      </div>

      {/* Featured Products Carousel */}
      <div className="container mx-auto px-4 mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Productos Destacados</h2>
        <ProductCarousel onAddToCart={addToCart} />
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
              onAddToCart={addToCart}
            />
          </div>
        </div>
      </div>

      <Cart 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onRemoveItem={removeFromCart}
        onUpdateQuantity={updateQuantity}
      />
    </div>
  );
};

export default Ofertas;
