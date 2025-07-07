import { AdminProduct } from "@/hooks/useProductAdmin";
import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: AdminProduct[];
  onEditProduct: (product: AdminProduct) => void;
  onDeleteProduct: (id: number) => void;
}

export const ProductGrid = ({ products, onEditProduct, onDeleteProduct }: ProductGridProps) => {
  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground text-lg">No hay productos registrados</p>
        <p className="text-muted-foreground">Crea tu primer producto usando el botón "Nuevo Producto"</p>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onEdit={onEditProduct}
          onDelete={onDeleteProduct}
        />
      ))}
    </div>
  );
};