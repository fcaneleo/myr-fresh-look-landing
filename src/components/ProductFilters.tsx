
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";

interface FilterState {
  category: string;
  priceRange: number[];
  sortBy: string;
}

interface ProductFiltersProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const ProductFilters = ({ filters, onFiltersChange }: ProductFiltersProps) => {
  const handleCategoryChange = (category: string) => {
    onFiltersChange({ ...filters, category });
  };

  const handlePriceRangeChange = (priceRange: number[]) => {
    onFiltersChange({ ...filters, priceRange });
  };

  const handleSortChange = (sortBy: string) => {
    onFiltersChange({ ...filters, sortBy });
  };

  const clearFilters = () => {
    onFiltersChange({
      category: "all",
      priceRange: [0, 50],
      sortBy: "name"
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Filtros</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Category Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Categoría
            </label>
            <Select value={filters.category} onValueChange={handleCategoryChange}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                <SelectItem value="aseo">Aseo</SelectItem>
                <SelectItem value="perfumeria">Perfumería</SelectItem>
                <SelectItem value="paqueteria">Paquetería</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Price Range Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Rango de Precio
            </label>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                max={50}
                min={0}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>${filters.priceRange[0]}</span>
                <span>${filters.priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Sort Filter */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Ordenar por
            </label>
            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger>
                <SelectValue placeholder="Ordenar por" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name">Nombre A-Z</SelectItem>
                <SelectItem value="name-desc">Nombre Z-A</SelectItem>
                <SelectItem value="price-asc">Precio: Menor a Mayor</SelectItem>
                <SelectItem value="price-desc">Precio: Mayor a Menor</SelectItem>
                <SelectItem value="newest">Más Recientes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Clear Filters Button */}
          <Button 
            variant="outline" 
            onClick={clearFilters}
            className="w-full"
          >
            Limpiar Filtros
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductFilters;
