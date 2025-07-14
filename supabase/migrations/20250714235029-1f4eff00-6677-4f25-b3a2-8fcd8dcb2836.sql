-- Actualizar la vista para incluir las columnas featured, oferta, vigencia e image_url
CREATE OR REPLACE VIEW vista_productos_completa AS
SELECT 
    p.*,
    f.descripcion as categoria_nombre
FROM productos p
LEFT JOIN familias f ON p.familia_id = f.id;