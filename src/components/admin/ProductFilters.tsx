import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useProductAdmin } from "@/hooks/useProductAdmin";

export interface AdminFilters {
  oferta: boolean;
  featured: boolean;
  porMayor: boolean;
  categoria: string;
  minPrice: string;
  maxPrice: string;
  sortBy: string;
}

interface ProductFiltersProps {
  filters: AdminFilters;
  onFiltersChange: (filters: AdminFilters) => void;
}

export const ProductFilters = ({ filters, onFiltersChange }: ProductFiltersProps) => {
  const { fetchFamilies } = useProductAdmin();
  const [familias, setFamilias] = useState<any[]>([]);

  useEffect(() => {
    const loadFamilias = async () => {
      const familiasList = await fetchFamilies();
      setFamilias(familiasList);
    };
    loadFamilias();
  }, []);

  const handleFilterChange = (key: keyof AdminFilters, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      oferta: false,
      featured: false,
      porMayor: false,
      categoria: "all",
      minPrice: "",
      maxPrice: "",
      sortBy: "default"
    });
  };

  const hasActiveFilters = filters.oferta || filters.featured || filters.porMayor || filters.categoria || filters.minPrice || filters.maxPrice || filters.sortBy;

  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Filtros</h3>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground">
              <X className="h-4 w-4 mr-1" />
              Limpiar filtros
            </Button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-4">
          {/* Switch Oferta */}
          <div className="flex items-center space-x-2">
            <Switch
              id="filter-oferta"
              checked={filters.oferta}
              onCheckedChange={(value) => handleFilterChange('oferta', value)}
            />
            <Label htmlFor="filter-oferta" className="text-sm">En Oferta</Label>
          </div>

          {/* Switch Destacado */}
          <div className="flex items-center space-x-2">
            <Switch
              id="filter-featured"
              checked={filters.featured}
              onCheckedChange={(value) => handleFilterChange('featured', value)}
            />
            <Label htmlFor="filter-featured" className="text-sm">Destacado</Label>
          </div>

          {/* Switch Por Mayor */}
          <div className="flex items-center space-x-2">
            <Switch
              id="filter-por-mayor"
              checked={filters.porMayor}
              onCheckedChange={(value) => handleFilterChange('porMayor', value)}
            />
            <Label htmlFor="filter-por-mayor" className="text-sm">Por Mayor</Label>
          </div>

          {/* Categoría */}
          <div>
            <Label htmlFor="filter-categoria" className="text-sm">Categoría</Label>
            <Select value={filters.categoria} onValueChange={(value) => handleFilterChange('categoria', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Todas" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {familias.map((familia) => (
                  <SelectItem key={familia.id} value={familia.nombre}>
                    {familia.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Precio Mínimo */}
          <div>
            <Label htmlFor="filter-min-price" className="text-sm">Precio Mín.</Label>
            <Input
              id="filter-min-price"
              type="number"
              placeholder="0"
              value={filters.minPrice}
              onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Precio Máximo */}
          <div>
            <Label htmlFor="filter-max-price" className="text-sm">Precio Máx.</Label>
            <Input
              id="filter-max-price"
              type="number"
              placeholder="∞"
              value={filters.maxPrice}
              onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              className="mt-1"
            />
          </div>

          {/* Ordenar por */}
          <div>
            <Label htmlFor="filter-sort" className="text-sm">Ordenar por</Label>
            <Select value={filters.sortBy} onValueChange={(value) => handleFilterChange('sortBy', value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Defecto" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Por defecto</SelectItem>
                <SelectItem value="name_asc">Nombre A-Z</SelectItem>
                <SelectItem value="name_desc">Nombre Z-A</SelectItem>
                <SelectItem value="price_asc">Precio menor a mayor</SelectItem>
                <SelectItem value="price_desc">Precio mayor a menor</SelectItem>
                <SelectItem value="newest">Más recientes</SelectItem>
                <SelectItem value="oldest">Más antiguos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};