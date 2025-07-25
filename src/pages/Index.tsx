
import Header from "../components/Header";
import Hero from "../components/Hero";
import HeroBannerCarousel from "../components/HeroBannerCarousel";
import ProductGrid from "../components/ProductGrid";
import Footer from "../components/Footer";

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  featured?: boolean;
  oferta?: boolean;
}

export interface CartItem extends Product {
  quantity: number;
}

const Index = () => {
  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      
      {/* Hero Banner Carousel */}
      <HeroBannerCarousel />
      
      <Hero />
      
      <ProductGrid />
      
      <Footer />
    </div>
  );
};

export default Index;
