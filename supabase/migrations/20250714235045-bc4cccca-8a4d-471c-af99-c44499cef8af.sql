-- Primero eliminar la vista existente
DROP VIEW IF EXISTS vista_productos_completa;

-- Crear la vista nuevamente con todas las columnas necesarias
CREATE VIEW vista_productos_completa AS
SELECT 
    p.id,
    p.codigo,
    p.codigo_texto,
    p.descripcion,
    p.descripcion_larga,
    p.precio,
    p.precio_mayor,
    p.costo,
    p.costo_neto,
    p.stock,
    p.stock_minimo,
    p.unidad_medida,
    p.familia_id,
    p.codigo_proveedor,
    p.codigo_proveedor2,
    p.codigo_proveedor3,
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
LEFT JOIN familias f ON p.familia_id = f.id;