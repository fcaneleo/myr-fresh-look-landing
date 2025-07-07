
import { useState } from "react";
import Header from "../components/Header";
import Hero from "../components/Hero";
import AllProductsCarousel from "../components/AllProductsCarousel";
import ProductGrid from "../components/ProductGrid";
import Cart from "../components/Cart";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
}

export interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

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
      <Hero />
      
      {/* Products Carousel */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Nuestros Productos</h2>
        <AllProductsCarousel onAddToCart={addToCart} />
      </div>
      
      <ProductGrid onAddToCart={addToCart} />
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

export default Index;
