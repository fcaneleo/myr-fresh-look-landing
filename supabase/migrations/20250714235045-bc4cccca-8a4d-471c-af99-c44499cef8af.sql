-- Primero eliminar la vista existente
DROP VIEW IF EXISTS vista_productos_completa;

-- Crear la vista nuevamente con todas las columnas necesarias
CREATE VIEW vista_productos_completa AS
SELECT 
    p.id,
    p.Codigo,
    p.Codigo_Texto,
    p.descripcion,
    p.descripcion_larga,
    p.precio,
    p.precio_mayor,
    p.costo,
    p.costo_neto,
    p.stock,
    p.stock_minimo,
    p.unidad_medida,
    p.Categoria,
    p.Codigo_proveedor,
    p.Codigo_proveedor2,
    p.Codigo_proveedor3,
    p.cantidad_mayor,
    p.ajuste,
    p.promocion,
    p.servicio,
    p.con_impuesto,
    p.tipo_impuesto,
    p.valor_impuesto,
    p.featured,
    p.oferta,
    p.vigencia,
    p.image_url,
    p.created_at,
    p.updated_at,
    f.descripcion as categoria_nombre
FROM productos p
LEFT JOIN familias f ON p.Categoria = f.id;