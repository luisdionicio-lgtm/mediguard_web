/* Resolución de la imagen de una guía.
 * Prioridad:
 *   1. guide.image  → URL real cargada en la BD (backend)
 *   2. respaldo por categoría (fotos del diseño Figma)
 *   3. null         → la card muestra el gradiente + icono de respaldo
 *
 * Las claves son los slugs REALES de category que devuelve el backend
 * (primeros-auxilios, heridas, quemaduras, traumatismos, pediatria).
 */
const CPR     = 'https://images.unsplash.com/photo-1755549746563-a7c0a391af36?w=800&h=500&fit=crop&auto=format';
const WOUND   = 'https://images.unsplash.com/photo-1600531105235-7a82db92fc46?w=800&h=500&fit=crop&auto=format';
const BURN    = 'https://images.unsplash.com/photo-1564144573017-8dc932e0039e?w=800&h=500&fit=crop&auto=format';

const CATEGORY_IMAGE = {
  'primeros-auxilios': CPR,
  'heridas':           WOUND,
  'quemaduras':        BURN,
  'traumatismos':      WOUND,
  'pediatria':         CPR,
};

export function guideImage(guide) {
  if (!guide) return null;
  if (guide.image) return guide.image;
  const key = (guide.category || '').toLowerCase().trim();
  return CATEGORY_IMAGE[key] || null;
}
