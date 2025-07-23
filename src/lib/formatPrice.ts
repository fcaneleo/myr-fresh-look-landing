/**
 * Formatea un Precio con separación de miles para Chile
 * @param price - El Precio a formatear
 * @returns El Precio formateado con formato chileno ($1.000)
 */
export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString('es-CL')}`;
};