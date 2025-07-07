
import Header from "../components/Header";
import Hero from "../components/Hero";
import AllProductsCarousel from "../components/AllProductsCarousel";
import ProductGrid from "../components/ProductGrid";

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
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Products Carousel */}
      <div className="container mx-auto px-4 py-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Nuestros Productos</h2>
        <AllProductsCarousel />
      </div>
      
      <Hero />
      
      <ProductGrid />
    </div>
  );
};

export default Index;
