import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export interface AdminProduct {
  id: number;
  descripcion: string;
  descripcion_larga: string | null;
  precio: number;
  precio_mayor: number | null;
  familia_nombre: string;
  familia_id: number;
  image_url: string | null;
  featured: boolean | null;
  oferta: boolean | null;
  vigencia: boolean | null;
}

export const useProductAdmin = () => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Fetch products
  const fetchProducts = async () => {
    console.log('Fetching products...');
    
    // First, let's get a count of all products to verify what we expect
    const { count: totalCount, error: countError } = await supabase
      .from('productos')
      .select('*', { count: 'exact', head: true })
      .eq('vigencia', true);
    
    if (countError) {
      console.error('Error counting products:', countError);
    } else {
      console.log(`Total products in DB with vigencia=true: ${totalCount}`);
    }

    // Use direct query with explicit join to get all products
    const { data, error } = await supabase
      .from('productos')
      .select(`
        id,
        descripcion,
        descripcion_larga,
        precio,
        precio_mayor,
        familia_id,
        image_url,
        featured,
        oferta,
        vigencia,
        familias!inner (
          nombre
        )
      `)
      .eq('vigencia', true)
      .order('id', { ascending: false });
    
    if (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los productos",
        variant: "destructive"
      });
      return;
    }
    
    console.log('Products fetched:', data?.length || 0, 'items');
    
    // Transform data to match AdminProduct interface
    const transformedProducts: AdminProduct[] = (data || []).map(item => ({
      id: item.id,
      descripcion: item.descripcion,
      descripcion_larga: item.descripcion_larga,
      precio: parseFloat(item.precio.toString()),
      precio_mayor: item.precio_mayor ? parseFloat(item.precio_mayor.toString()) : null,
      familia_nombre: (item.familias as any)?.nombre || '',
      familia_id: item.familia_id,
      image_url: item.image_url,
      featured: item.featured,
      oferta: item.oferta,
      vigencia: item.vigencia
    }));
    
    // Debug: count products with precio_mayor > 0
    const productsWithPrecioMayor = transformedProducts.filter(p => p.precio_mayor && p.precio_mayor > 0);
    console.log(`Total products loaded: ${transformedProducts.length}`);
    console.log(`Expected count from DB: ${totalCount}`);
    console.log(`Products with precio_mayor > 0: ${productsWithPrecioMayor.length}`);
    console.log(`Products with precio_mayor > 100: ${transformedProducts.filter(p => p.precio_mayor && p.precio_mayor > 100).length}`);
    
    if (transformedProducts.length !== totalCount) {
      console.warn(`MISMATCH: Expected ${totalCount} products but got ${transformedProducts.length}`);
      console.warn('This could indicate an issue with the join or data consistency');
    } else {
      console.log('✅ SUCCESS: All products loaded correctly!');
    }
    
    setProducts(transformedProducts);
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

  // Fetch families for categories
  const fetchFamilies = async () => {
    const { data, error } = await supabase
      .from('familias')
      .select('*')
      .order('nombre', { ascending: true });
    
    if (error) {
      console.error('Error fetching families:', error);
      return [];
    }
    
    return data || [];
  };

  // Delete image from storage
  const deleteImageFromStorage = async (imageUrl: string) => {
    try {
      // Extract filename from the public URL
      const urlParts = imageUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      
      console.log('Deleting image from storage:', fileName);
      
      const { error } = await supabase.storage
        .from('product-images')
        .remove([fileName]);
      
      if (error) {
        console.error('Error deleting image from storage:', error);
      } else {
        console.log('Image deleted successfully from storage');
      }
    } catch (error) {
      console.error('Error parsing image URL for deletion:', error);
    }
  };

  // Save product (create or update)
  const saveProduct = async (
    formData: {
      name: string;
      description: string;
      price: string;
      category: string;
      featured: boolean;
      oferta: boolean;
    },
    imageFile: File | null | 'REMOVE_IMAGE',
    editingProduct: AdminProduct | null
  ) => {
    setIsLoading(true);
    
    try {
      let imageUrl = editingProduct?.image_url || null;
      const oldImageUrl = editingProduct?.image_url;
      
      console.log('Starting save product. Current image URL:', imageUrl);
      console.log('Image file selected:', typeof imageFile === 'string' ? imageFile : (imageFile ? imageFile.name : 'None'));
      
      // Check if we're explicitly removing the image
      if (imageFile === 'REMOVE_IMAGE') {
        // Delete old image from storage if exists
        if (oldImageUrl) {
          await deleteImageFromStorage(oldImageUrl);
        }
        imageUrl = null;
        console.log('Image explicitly removed - setting URL to null');
      }
      // Upload new image if selected
      else if (imageFile && typeof imageFile !== 'string') {
        console.log('Uploading new image...');
        const uploadedUrl = await uploadImage(imageFile);
        console.log('Upload result:', uploadedUrl);
        if (uploadedUrl) {
          // Delete old image from storage if exists and different from new one
          if (oldImageUrl && oldImageUrl !== uploadedUrl) {
            await deleteImageFromStorage(oldImageUrl);
          }
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

      // Find familia_id by category name
      const familias = await fetchFamilies();
      const familia = familias.find(f => f.nombre.toLowerCase() === formData.category.toLowerCase());
      
      if (!familia && !editingProduct) {
        toast({
          title: "Error",
          description: "Categoría no encontrada",
          variant: "destructive"
        });
        return false;
      }

      const productData = {
        descripcion: formData.name,
        descripcion_larga: formData.description || null,
        precio: parseFloat(formData.price),
        familia_id: familia?.id || editingProduct?.familia_id,
        image_url: imageUrl,
        featured: formData.featured,
        oferta: formData.oferta
      };

      console.log('Product data to save:', productData);

      if (editingProduct) {
        // Update existing product
        console.log('Updating product with ID:', editingProduct.id);
        console.log('Image URL to save:', imageUrl);
        const { error } = await supabase
          .from('productos')
          .update(productData)
          .eq('id', editingProduct.id);
        
        if (error) {
          console.error('Update error:', error);
          throw error;
        }
        
        // Verify the update worked
        const { data: verifyData } = await supabase
          .from('productos')
          .select('image_url')
          .eq('id', editingProduct.id)
          .single();
        
        console.log('Updated product image_url in DB:', verifyData?.image_url);
        console.log('Product updated successfully');
        toast({
          title: "Producto actualizado",
          description: "El producto se ha actualizado correctamente"
        });
      } else {
        // Create new product - need to add required fields
        const completeProductData = {
          ...productData,
          codigo: Date.now(), // temporary solution for required campo
          codigo_texto: `PROD_${Date.now()}`,
          costo: 0,
          stock: 0,
          unidad_medida: 1,
          vigencia: true
        };
        
        console.log('Creating new product');
        const { error } = await supabase
          .from('productos')
          .insert([completeProductData]);
        
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
    
    // First get the product to check if it has an image
    const { data: productData } = await supabase
      .from('productos')
      .select('image_url')
      .eq('id', id)
      .single();
    
    // Delete image from storage if exists
    if (productData?.image_url) {
      await deleteImageFromStorage(productData.image_url);
    }
    
    const { error } = await supabase
      .from('productos')
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
    fetchFamilies,
    saveProduct,
    deleteProduct
  };
};