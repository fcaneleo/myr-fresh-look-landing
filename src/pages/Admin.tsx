import { useState, useEffect, useMemo } from "react";
import { Plus, Lock, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductAdmin, AdminProduct } from "@/hooks/useProductAdmin";
import { ProductForm } from "@/components/admin/ProductForm";
import { PaginatedProductGrid } from "@/components/admin/PaginatedProductGrid";
import { ProductFilters, AdminFilters } from "@/components/admin/ProductFilters";
import Header from "../components/Header";

const Admin = () => {
  const { products, isLoading, fetchProducts, saveProduct, deleteProduct } = useProductAdmin();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<AdminProduct | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<AdminFilters>({
    oferta: false,
    featured: false,
    porMayor: false,
    categoria: "all",
    minPrice: "",
    maxPrice: "",
    sortBy: "default"
  });

  useEffect(() => {
    if (isAuthenticated) {
      fetchProducts();
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === "admin" && password === "Vale8253") {
      setIsAuthenticated(true);
      setAuthError("");
    } else {
      setAuthError("Usuario o contraseña incorrectos");
    }
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

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];
    
    // Apply search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(product => 
        product.Descripcion.toLowerCase().includes(term) ||
        product.descripcion_larga?.toLowerCase().includes(term) ||
        product.familia_nombre.toLowerCase().includes(term)
      );
    }
    
    // Apply admin filters
    if (filters.oferta) {
      filtered = filtered.filter(product => product.oferta === true);
    }
    
    if (filters.featured) {
      filtered = filtered.filter(product => product.featured === true);
    }
    
    if (filters.porMayor) {
      filtered = filtered.filter(product => product.Precio_Mayor && product.Precio_Mayor > 100);
    }
    
    if (filters.categoria && filters.categoria !== "all") {
      console.log('Filtering by categoria:', filters.categoria);
      console.log('Available products with familia_nombre:', products.map(p => ({ id: p.id, Descripcion: p.Descripcion, familia_nombre: p.familia_nombre })));
      filtered = filtered.filter(product => product.familia_nombre === filters.categoria);
      console.log('Filtered products:', filtered.length);
    }
    
    if (filters.minPrice) {
      const minPrice = parseFloat(filters.minPrice);
      filtered = filtered.filter(product => product.Precio >= minPrice);
    }
    
    if (filters.maxPrice) {
      const maxPrice = parseFloat(filters.maxPrice);
      filtered = filtered.filter(product => product.Precio <= maxPrice);
    }
    
    // Apply sorting
    switch (filters.sortBy) {
      case 'name_asc':
        filtered.sort((a, b) => a.Descripcion.localeCompare(b.Descripcion));
        break;
      case 'name_desc':
        filtered.sort((a, b) => b.Descripcion.localeCompare(a.Descripcion));
        break;
      case 'price_asc':
        filtered.sort((a, b) => a.Precio - b.Precio);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.Precio - a.Precio);
        break;
      case 'newest':
        filtered.sort((a, b) => b.id - a.id);
        break;
      case 'oldest':
        filtered.sort((a, b) => a.id - b.id);
        break;
      case 'default':
      default:
        // Keep default order (by id desc)
        break;
    }
    
    return filtered;
  }, [products, searchTerm, filters]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="bg-primary/20 w-16 h-16 rounded-full flex items-center justify-center">
                <Lock className="h-8 w-8 text-primary" />
              </div>
            </div>
            <CardTitle>Acceso Administrativo</CardTitle>
            <CardDescription>
              Ingresa tus credenciales para acceder al panel de administración
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="Usuario"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
              <div>
                <Input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {authError && (
                <p className="text-destructive text-sm text-center">{authError}</p>
              )}
              <Button type="submit" className="w-full">
                Iniciar Sesión
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Administrar Productos</h1>
            <p className="text-muted-foreground">Gestiona el catálogo de productos de tu tienda</p>
          </div>
          
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
            <Button 
              variant="outline" 
              onClick={() => setIsAuthenticated(false)}
              className="text-muted-foreground order-2 sm:order-1"
            >
              Cerrar Sesión
            </Button>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button onClick={openCreateDialog} className="bg-primary hover:bg-primary/90 order-1 sm:order-2">
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

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-primary focus:border-primary ring-primary"
            />
          </div>
          {(searchTerm || Object.values(filters).some(f => f)) && (
            <p className="text-sm text-muted-foreground mt-2">
              Mostrando {filteredProducts.length} de {products.length} productos
            </p>
          )}
        </div>

        {/* Filters */}
        <ProductFilters
          filters={filters}
          onFiltersChange={setFilters}
        />

        <PaginatedProductGrid
          products={filteredProducts}
          onEditProduct={openEditDialog}
          onDeleteProduct={deleteProduct}
        />
      </div>
    </div>
  );
};

export default Admin;