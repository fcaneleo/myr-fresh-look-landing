-- Verificar y limpiar cualquier función o vista problemática
-- Primero, eliminar completamente la vista actual
DROP VIEW IF EXISTS public.vista_productos_completa CASCADE;

-- Verificar si hay alguna función con SECURITY DEFINER problemática
DROP FUNCTION IF EXISTS public.get_productos_completos() CASCADE;

-- Recrear la vista de manera segura sin SECURITY DEFINER
CREATE VIEW public.vista_productos_completa AS
SELECT
    p.id,
    p."Codigo",
    p."Codigo_Texto", 
    p."Descripcion",
    p.descripcion_larga,
    p."Precio",
    p."Precio_Mayor",
    p."Costo",
    p."Costo_Neto",
    p."Stock",
    p."Stock_Minimo",
    p."Unidad_Medida",
    p."Categoria",
    p."Codigo_Proveedor",
    p."Codigo_Proveedor2",
    p."Codigo_Proveedor3",
    p."Cantidad_Mayor",
    p."Ajuste",
    p."Promocion",
    p."Servicio",
    p."Con_Impuesto",
    p."Tipo_Impuesto",
    p."Valor_Impuesto",
    p.featured,
    p.oferta,
    p.vigencia,
    p.image_url,
    p.created_at,
    p.updated_at,
    f.nombre as categoria_nombre
FROM public.productos p
LEFT JOIN public.familias f ON p."Categoria" = f.id
WHERE p.vigencia = true;