import { useState, useEffect } from "react";
import { ChevronLeft, LogOut, Plus, Search } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useCategories } from "@/hooks/useCategories";
import { useProductAdmin, AdminProduct } from "@/hooks/useProductAdmin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import Header from "../components/Header";
import AdminFilters from "../components/admin/AdminFilters";
import AdminPaginatedProductList from "../components/admin/AdminPaginatedProductList";
import { ProductForm } from "@/components/admin/ProductForm";
import Footer from "../components/Footer";

const Admin2 = () => {
  const [searchParams] = useSearchParams();
  const { categories } = useCategories();
  const categoriaId = searchParams.get('categoria');
  const [searchTerm, setSearchTerm] = useState("");
  
  // Admin functionality
  const { products, isLoading, fetchProducts, saveProduct, deleteProduct } = useProductAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  
  const [selectedFilters, setSelectedFilters] = useState({
    category: categoriaId || "all",
    priceRange: [0, 55000],
    sortBy: "name",
    featured: false,
    oferta: false,
    porMayor: false,
    searchTerm: ""
  });

  // Update filters when URL parameter changes
  useEffect(() => {
    setSelectedFilters(prev => ({
      ...prev,
      category: categoriaId || "all"
    }));
  }, [categoriaId]);

  // Update search in filters when searchTerm changes
  useEffect(() => {
    setSelectedFilters(prev => ({
      ...prev,
      searchTerm: searchTerm
    }));
  }, [searchTerm]);

  // Fetch products when admin functionality is needed
  useEffect(() => {
    fetchProducts();
  }, []);

  // Find the current category name for display
  const currentCategory = categoriaId 
    ? categories.find(cat => cat.id.toString() === categoriaId)
    : null;

  const handleClearFilters = () => {
    setSelectedFilters({
      category: "all",
      priceRange: [0, 55000],
      sortBy: "name",
      featured: false,
      oferta: false,
      porMayor: false,
      searchTerm: ""
    });
    setSearchTerm("");
  };

  const handleLogout = () => {
    // Aquí iría la lógica de logout
    console.log("Cerrar sesión");
  };

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
    imageFile: File | null | 'REMOVE_IMAGE'
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
      
      {/* Admin Header */}
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-primary transition-colors">
              Inicio
            </Link>
            <ChevronLeft className="h-4 w-4 rotate-180" />
            <span className="font-medium text-foreground">Admin 2</span>
          </div>

          {/* Header con botones */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                Administrar Productos
              </h1>
              <p className="text-muted-foreground">
                Gestiona el catálogo de productos de tu tienda
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Cerrar Sesión
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={openCreateDialog}>
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
          </div>

          {/* Buscador */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Mostrar total de productos */}
          <div className="text-sm text-muted-foreground">
            Mostrando productos del catálogo
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="container mx-auto px-4 mb-8">
        <AdminFilters 
          filters={selectedFilters}
          onFiltersChange={setSelectedFilters}
          onClearFilters={handleClearFilters}
        />
      </div>

      {/* Product List */}
      <div className="container mx-auto px-4 pb-8">
        <AdminPaginatedProductList 
          filters={selectedFilters}
          onEditProduct={openEditDialog}
          onDeleteProduct={deleteProduct}
        />
      </div>
      
      <Footer />
    </div>
  );
};

export default Admin2;