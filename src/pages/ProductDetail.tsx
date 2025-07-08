import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "@/components/Header";

interface ProductDetail {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  featured: boolean | null;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', parseInt(id))
          .eq('vigencia', true)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          toast({
            title: "Error",
            description: "No se pudo cargar el producto",
            variant: "destructive"
          });
          navigate('/');
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "Producto no encontrado",
          variant: "destructive"
        });
        navigate('/');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate, toast]);

  const getCategoryDisplayName = (category: string) => {
    switch (category) {
      case 'aseo':
        return 'Aseo';
      case 'perfumeria':
        return 'Perfumería';
      case 'paqueteria':
        return 'Paquetería';
      default:
        return category;
    }
  };

  const handleWhatsAppContact = () => {
    const message = `Hola, me interesa el producto: ${product?.name} - $${product?.price.toLocaleString('es-CL')}`;
    const whatsappUrl = `https://wa.me/56912345678?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Cargando producto...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-muted-foreground">Producto no encontrado</p>
            <Button onClick={() => navigate('/')} className="mt-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver al catálogo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Volver al catálogo
        </Button>

        <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {/* Product Image */}
          <div className="aspect-square relative">
            {product.image_url ? (
              <img 
                src={product.image_url} 
                alt={product.name}
                className="w-full h-full object-cover rounded-lg shadow-lg"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/30 rounded-lg shadow-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xl text-center px-4">
                  {product.name}
                </span>
              </div>
            )}
            {product.featured && (
              <Badge className="absolute top-4 left-4 bg-primary">
                Destacado
              </Badge>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <Badge variant="secondary" className="mb-2">
                {getCategoryDisplayName(product.category)}
              </Badge>
              <h1 className="text-3xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <div className="text-4xl font-bold text-primary mb-6">
                ${product.price.toLocaleString('es-CL')}
              </div>
            </div>

            {/* Description */}
            {product.description && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Descripción
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="space-y-4 pt-6">
              <Button 
                onClick={handleWhatsAppContact}
                className="w-full bg-primary hover:bg-primary/90"
                size="lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Consultar por WhatsApp
              </Button>
              
              <div className="text-center text-sm text-muted-foreground">
                Contáctanos para más información sobre este producto
              </div>
            </div>

            {/* Additional Info */}
            <div className="border-t border-border pt-6 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Categoría:</span>
                <span className="text-foreground">{getCategoryDisplayName(product.category)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Disponibilidad:</span>
                <span className="text-green-600 font-medium">En stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;