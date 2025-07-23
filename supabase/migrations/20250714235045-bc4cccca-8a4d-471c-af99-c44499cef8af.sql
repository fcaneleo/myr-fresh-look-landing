-- Primero eliminar la vista existente
DROP VIEW IF EXISTS vista_productos_completa;

-- Crear la vista nuevamente con todas las columnas necesarias
CREATE VIEW vista_productos_completa AS
SELECT 
    p.id,
    p.Codigo,
    p.Codigo_Texto,
    p.Descripcion,
    p.descripcion_larga,
    p.Precio,
    p.Precio_Mayor,
    p.Costo,
    p.Costo_Neto,
    p.Stock,
    p.Stock_Minimo,
    p.Unidad_Medida,
    p.Categoria,
    p.Codigo_Proveedor,
    p.Codigo_Proveedor2,
    p.Codigo_Proveedor3,
    p.Cantidad_Mayor,
    p.Ajuste,
    p.Promocion,
    p.Servicio,
    p.Con_Impuesto,
    p.Tipo_Impuesto,
    p.Valor_Impuesto,
    p.featured,
    p.oferta,
    p.vigencia,
    p.image_url,
    p.created_at,
    p.updated_at,
    f.Descripcion as categoria_nombre
FROM productos p
LEFT JOIN familias f ON p.Categoria = f.id;