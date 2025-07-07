import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface AdminProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  category: string;
  image_url: string | null;
  featured: boolean | null;
  vigencia: boolean | null;
}

export const useProductAdmin = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch products
  const fetchProducts = async () => {
    console.log('Fetching products...');
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('vigencia', true)
      .order('id', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive"
      });
    } else {
      console.log('Products fetched:', data?.length || 0, 'items');
      setProducts(data || []);
    }
  };

  // Upload image to Supabase Storage
  const uploadImage = async (file: File): Promise<string | null> => {
    console.log('Starting image upload:', file.name, file.size);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `product_${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    
    console.log('Generated filename:', fileName);
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading image:', error);
      return null;
    }

    console.log('Upload successful:', data);

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(fileName);

    console.log('Generated public URL:', publicUrl);
    return publicUrl;
  };

  // Save product (create or update)
  const saveProduct = async (
    formData: {
      name: string;
      description: string;
      price: string;
      category: string;
      featured: boolean;
    },
    imageFile: File | null,
    editingProduct: AdminProduct | null
  ) => {
    setIsLoading(true);
    
    try {
      let imageUrl = editingProduct?.image_url || null;
      
      console.log('Starting save product. Current image URL:', imageUrl);
      console.log('Image file selected:', imageFile ? imageFile.name : 'None');
      
      // Upload new image if selected
      if (imageFile) {
        console.log('Uploading new image...');
        const uploadedUrl = await uploadImage(imageFile);
        console.log('Upload result:', uploadedUrl);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
          console.log('Image URL updated to:', imageUrl);
        } else {
          console.error('Failed to upload image');
          toast({
            title: "Error",
            description: "No se pudo subir la imagen",
            variant: "destructive"
          });
          return false;
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

      console.log('Product data to save:', productData);

      if (editingProduct) {
        // Update existing product
        console.log('Updating product with ID:', editingProduct.id);
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', editingProduct.id);
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        console.log('Product updated successfully');
        toast({
          title: "Producto actualizado",
          description: "El producto se ha actualizado correctamente"
        });
      } else {
        // Create new product
        console.log('Creating new product');
        const { error } = await supabase
          .from('products')
          .insert([productData]);
        
        if (error) {
          console.error('Insert error:', error);
          throw error;
        }
        
        console.log('Product created successfully');
        toast({
          title: "Producto creado",
          description: "El producto se ha creado correctamente"
        });
      }

      await fetchProducts();
      console.log('Products refreshed after save');
      return true;
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el producto",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Delete product (logical deletion)
  const deleteProduct = async (id: number) => {
    if (!confirm('¿Estás seguro de que quieres eliminar este producto?')) {
      return;
    }

    console.log('Logically deleting product with ID:', id);
    const { error } = await supabase
      .from('products')
      .update({ vigencia: false })
      .eq('id', id);

    if (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el producto",
        variant: "destructive"
      });
    } else {
      console.log('Product deleted successfully');
      toast({
        title: "Producto eliminado",
        description: "El producto se ha eliminado correctamente"
      });
      await fetchProducts();
    }
  };

  return {
    products,
    isLoading,
    fetchProducts,
    saveProduct,
    deleteProduct
  };
};