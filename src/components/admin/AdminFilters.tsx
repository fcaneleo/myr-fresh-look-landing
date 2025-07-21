import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { X } from "lucide-react";
import { useCategories } from "@/hooks/useCategories";

interface AdminFiltersProps {
  filters: {
    category: string;
    priceRange: number[];
    sortBy: string;
    featured: boolean;
    oferta: boolean;
    porMayor: boolean;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

const AdminFilters = ({ filters, onFiltersChange, onClearFilters }: AdminFiltersProps) => {
  const { categories, loading: categoriesLoading } = useCategories();

  const handleFilterChange = (key: string, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handlePriceChange = (index: number, value: string) => {
    const newPriceRange = [...filters.priceRange];
    newPriceRange[index] = parseInt(value) || 0;
    handleFilterChange('priceRange', newPriceRange);
  };

  return (
    <div className="bg-card border rounded-lg p-6 mb-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-foreground">Filtros</h2>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4 mr-1" />
          Limpiar filtros
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 items-end">
        {/* Switch para En Oferta */}
        <div className="space-y-2">
          <Label htmlFor="oferta-switch" className="text-sm font-medium">
            En Oferta
          </Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="oferta-switch"
              checked={filters.oferta}
              onCheckedChange={(checked) => handleFilterChange('oferta', checked)}
            />
          </div>
        </div>

        {/* Switch para Destacado */}
        <div className="space-y-2">
          <Label htmlFor="featured-switch" className="text-sm font-medium">
            Destacado
          </Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="featured-switch"
              checked={filters.featured}
              onCheckedChange={(checked) => handleFilterChange('featured', checked)}
            />
          </div>
        </div>

        {/* Switch para Por Mayor */}
        <div className="space-y-2">
          <Label htmlFor="pormayor-switch" className="text-sm font-medium">
            Por Mayor
          </Label>
          <div className="flex items-center space-x-2">
            <Switch
              id="pormayor-switch"
              checked={filters.porMayor}
              onCheckedChange={(checked) => handleFilterChange('porMayor', checked)}
            />
          </div>
        </div>

        {/* Categoría */}
        <div className="space-y-2">
          <Label htmlFor="category-select" className="text-sm font-medium">
            Categoría
          </Label>
          <Select
            value={filters.category}
            onValueChange={(value) => handleFilterChange('category', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Todas las categorías" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas las categorías</SelectItem>
              {!categoriesLoading && categories.map((category) => (
                <SelectItem key={category.id} value={category.id.toString()}>
                  {category.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Precio Mínimo */}
        <div className="space-y-2">
          <Label htmlFor="price-min" className="text-sm font-medium">
            Precio Mín.
          </Label>
          <Input
            id="price-min"
            type="number"
            placeholder="0"
            value={filters.priceRange[0]}
            onChange={(e) => handlePriceChange(0, e.target.value)}
            className="w-full"
          />
        </div>

        {/* Precio Máximo */}
        <div className="space-y-2">
          <Label htmlFor="price-max" className="text-sm font-medium">
            Precio Máx.
          </Label>
          <Input
            id="price-max"
            type="number"
            placeholder="∞"
            value={filters.priceRange[1]}
            onChange={(e) => handlePriceChange(1, e.target.value)}
            className="w-full"
          />
        </div>

        {/* Ordenar por */}
        <div className="space-y-2 md:col-span-2 lg:col-span-1">
          <Label htmlFor="sort-select" className="text-sm font-medium">
            Ordenar por
          </Label>
          <Select
            value={filters.sortBy}
            onValueChange={(value) => handleFilterChange('sortBy', value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Por defecto" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Por defecto</SelectItem>
              <SelectItem value="price_asc">Precio: Menor a Mayor</SelectItem>
              <SelectItem value="price_desc">Precio: Mayor a Menor</SelectItem>
              <SelectItem value="newest">Más Recientes</SelectItem>
              <SelectItem value="oldest">Más Antiguos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default AdminFilters;