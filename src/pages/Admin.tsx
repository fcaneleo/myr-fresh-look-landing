import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import Header from "../components/Header";

interface Product {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  featured: boolean | null;
}

const Admin = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    featured: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch products
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('id', { ascending: false });
    
    if (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive"
      });
    } else {
      setProducts(data || []);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Handle form changes
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handle image selection
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file);

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  // Save product
  const saveProduct = async () => {
    setIsLoading(true);
    
    try {
      let imageUrl = editingProduct?.image_url || null;
      
      // Upload new image if selected
      if (imageFile) {
        const uploadedUrl = await uploadImage(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        }
      }

      const productData = {
        name: formData.name,
        description: formData.description || null,
        price: parseFloat(formData.price),
        category: formData.category,
        image_url: imageUrl,
        featured: formData.featured
      };

      if (editingProduct) {
        // Update existing product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        
        if (error) throw error;
        
        toast({
          title: "Producto actualizado",
          description: "El producto se ha actualizado correctamente"
        });
      } else {
        // Create new product
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) throw error;
        
        toast({
          title: "Producto creado",
          description: "El producto se ha creado correctamente"
        });
      }

      resetForm();
      fetchProducts();
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el producto",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product
  const deleteProduct = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado correctamente"
      });
      fetchProducts();
    }
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      featured: false
    });
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
  };

  // Open edit dialog
  const openEditDialog = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category,
      featured: product.featured || false
    });
    setImagePreview(product.image_url);
    setIsDialogOpen(true);
  };

  // Open create dialog
  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Administrar Productos</h1>
            <p className="text-muted-foreground">Gestiona el catálogo de productos de tu tienda</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog} className="bg-primary hover:bg-primary/90">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo Producto
              </Button>
            </DialogTrigger>
            
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Image Upload */}
                <div>
                  <Label htmlFor="image">Imagen del Producto</Label>
                  <div className="mt-2">
                    {imagePreview ? (
                      <div className="relative">
                        <img 
                          src={imagePreview} 
                          alt="Preview" 
                          className="w-full h-48 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2"
                          onClick={() => {
                            setImagePreview(null);
                            setImageFile(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Click para subir imagen</p>
                      </div>
                    )}
                    <Input
                      id="image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageSelect}
                      className="mt-2"
                    />
                  </div>
                </div>

                {/* Product Name */}
                <div>
                  <Label htmlFor="name">Nombre del Producto *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Ej: Perfume Channel Elegance"
                  />
                </div>

                {/* Description */}
                <div>
                  <Label htmlFor="description">Descripción</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Describe las características del producto..."
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {/* Price */}
                  <div>
                    <Label htmlFor="price">Precio (CLP) *</Label>
                    <Input
                      id="price"
                      type="number"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      placeholder="0"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label htmlFor="category">Categoría *</Label>
                    <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="aseo">Aseo</SelectItem>
                        <SelectItem value="perfumeria">Perfumería</SelectItem>
                        <SelectItem value="paqueteria">Paquetería</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Featured */}
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(value) => handleInputChange('featured', value)}
                  />
                  <Label htmlFor="featured">Producto destacado</Label>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-3 pt-4">
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={saveProduct} 
                    disabled={!formData.name || !formData.price || !formData.category || isLoading}
                  >
                    {isLoading ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Crear'}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="aspect-square relative">
                {product.image_url ? (
                  <img 
                    src={product.image_url} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground">Sin imagen</span>
                  </div>
                )}
                {product.featured && (
                  <Badge className="absolute top-2 left-2 bg-primary">
                    Destacado
                  </Badge>
                )}
              </div>
              
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{product.name}</CardTitle>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price.toLocaleString('es-CL')}
                  </span>
                  <Badge variant="secondary">{product.category}</Badge>
                </div>
              </CardHeader>
              
              <CardContent className="pt-0">
                {product.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                    {product.description}
                  </p>
                )}
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(product)}
                    className="flex-1"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteProduct(product.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No hay productos registrados</p>
            <p className="text-muted-foreground">Crea tu primer producto usando el botón "Nuevo Producto"</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;