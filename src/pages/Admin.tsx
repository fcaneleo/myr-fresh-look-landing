import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { useProductAdmin, AdminProduct } from "@/hooks/useProductAdmin";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductGrid } from "@/components/admin/ProductGrid";
import Header from "../components/Header";

const Admin = () => {
  const { products, isLoading, fetchProducts, saveProduct, deleteProduct } = useProductAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  // Open edit dialog
  const openEditDialog = (product: AdminProduct) => {
    setEditingProduct(product);
    setIsDialogOpen(true);
  };

  // Open create dialog
  const openCreateDialog = () => {
    setEditingProduct(null);
    setIsDialogOpen(true);
  };

  // Handle save product
  const handleSaveProduct = async (
    formData: {
      name: string;
      description: string;
      price: string;
      category: string;
      featured: boolean;
      oferta: boolean;
    },
    imageFile: File | null
  ) => {
    const success = await saveProduct(formData, imageFile, editingProduct);
    if (success) {
      setIsDialogOpen(false);
      setEditingProduct(null);
    }
    return success;
  };

  // Handle close dialog
  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingProduct(null);
  };

  return (
    <div className="min-h-screen bg-background pt-20">
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
            
            <ProductForm
              isOpen={isDialogOpen}
              onClose={handleCloseDialog}
              onSave={handleSaveProduct}
              editingProduct={editingProduct}
              isLoading={isLoading}
            />
          </Dialog>
        </div>

        <ProductGrid
          products={products}
          onEditProduct={openEditDialog}
          onDeleteProduct={deleteProduct}
        />
      </div>
    </div>
  );
};

export default Admin;