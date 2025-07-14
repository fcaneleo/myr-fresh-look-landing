/**
 * Formatea un precio con separación de miles para Chile
 * @param price - El precio a formatear
 * @returns El precio formateado con formato chileno ($1.000)
 */
export const formatPrice = (price: number): string => {
  return `$${price.toLocaleString('es-CL')}`;
};