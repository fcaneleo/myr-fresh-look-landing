import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { AdminProduct, useProductAdmin } from "@/hooks/useProductAdmin";

interface ProductFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (
    formData: {
      name: string;
      description: string;
      price: string;
      category: string;
      featured: boolean;
      oferta: boolean;
    },
    imageFile: File | null
  ) => Promise<boolean>;
  editingProduct: AdminProduct | null;
  isLoading: boolean;
}

export const ProductForm = ({ 
  isOpen, 
  onClose, 
  onSave, 
  editingProduct, 
  isLoading 
}: ProductFormProps) => {
  const { fetchFamilies } = useProductAdmin();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    featured: false,
    oferta: false
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [familias, setFamilias] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

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
    setUploadError(null);
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUploadError('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUploadError('La imagen debe ser menor a 10MB');
        return;
      }
      
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle save
  const handleSave = async () => {
    setIsUploading(true);
    setUploadError(null);
    
    try {
      const success = await onSave(formData, imageFile);
      if (success) {
        handleClose();
      }
    } catch (error) {
      setUploadError('Error al guardar el producto. Intenta nuevamente.');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle close and reset
  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      featured: false,
      oferta: false
    });
    setImageFile(null);
    setImagePreview(null);
    setUploadError(null);
    setIsUploading(false);
    onClose();
  };

  // Load families on component mount
  useEffect(() => {
    const loadFamilias = async () => {
      const familiasList = await fetchFamilies();
      setFamilias(familiasList);
    };
    loadFamilias();
  }, []);

  // Update form when editing product changes
  useEffect(() => {
    if (editingProduct) {
      setFormData({
        name: editingProduct.descripcion,
        description: editingProduct.descripcion_larga || "",
        price: editingProduct.precio.toString(),
        category: editingProduct.familia_nombre,
        featured: Boolean(editingProduct.featured),
        oferta: Boolean(editingProduct.oferta)
      });
      setImagePreview(editingProduct.image_url);
      setImageFile(null);
    } else {
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "",
        featured: false,
        oferta: false
      });
      setImagePreview(null);
      setImageFile(null);
    }
  }, [editingProduct]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
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
                  {isUploading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center rounded-lg">
                      <div className="text-white text-sm">Subiendo imagen...</div>
                    </div>
                  )}
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setImagePreview(null);
                      setImageFile(null);
                      setUploadError(null);
                    }}
                    disabled={isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">Click para subir imagen</p>
                  <p className="text-xs text-muted-foreground mt-1">JPG, PNG, WEBP (máx. 10MB)</p>
                </div>
              )}
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="mt-2"
                disabled={isUploading}
              />
              {uploadError && (
                <p className="text-destructive text-sm mt-2">{uploadError}</p>
              )}
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
                  {familias.map((familia) => (
                    <SelectItem key={familia.id} value={familia.nombre}>
                      {familia.nombre}
                    </SelectItem>
                  ))}
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

          {/* Oferta */}
          <div className="flex items-center space-x-2">
            <Switch
              id="oferta"
              checked={formData.oferta}
              onCheckedChange={(value) => handleInputChange('oferta', value)}
            />
            <Label htmlFor="oferta">Producto en oferta</Label>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSave} 
              disabled={!formData.name || !formData.price || !formData.category || isLoading || isUploading}
            >
              {isUploading ? 'Subiendo imagen...' : isLoading ? 'Guardando...' : editingProduct ? 'Actualizar' : 'Crear'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};