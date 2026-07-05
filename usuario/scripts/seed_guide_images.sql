-- ============================================================
-- Imágenes de guías de primeros auxilios (content_guide.image)
-- ------------------------------------------------------------
-- El backend usa spring.jpa.hibernate.ddl-auto=none, así que el
-- esquema NO lo altera JPA: ejecuta este script manualmente contra
-- la BD Postgres (mediguard_web) una sola vez.
--
--   psql -U postgres -d mediguard_web -f seed_guide_images.sql
--
-- El frontend usa guide.image como URL directa (<img src=...>);
-- si una guía no tiene URL, muestra un respaldo por categoría.
-- ============================================================

-- 1) Ampliar la columna para que quepan URLs completas (antes varchar(100)).
ALTER TABLE content_guide ALTER COLUMN image TYPE varchar(500);

-- 2) Cargar las URLs por categoría real (slugs que devuelve el backend).
UPDATE content_guide SET image =
  'https://images.unsplash.com/photo-1755549746563-a7c0a391af36?w=800&h=500&fit=crop&auto=format'
  WHERE category = 'primeros-auxilios';

UPDATE content_guide SET image =
  'https://images.unsplash.com/photo-1600531105235-7a82db92fc46?w=800&h=500&fit=crop&auto=format'
  WHERE category = 'heridas';

UPDATE content_guide SET image =
  'https://images.unsplash.com/photo-1564144573017-8dc932e0039e?w=800&h=500&fit=crop&auto=format'
  WHERE category = 'quemaduras';

UPDATE content_guide SET image =
  'https://images.unsplash.com/photo-1600531105235-7a82db92fc46?w=800&h=500&fit=crop&auto=format'
  WHERE category = 'traumatismos';

UPDATE content_guide SET image =
  'https://images.unsplash.com/photo-1755549746563-a7c0a391af36?w=800&h=500&fit=crop&auto=format'
  WHERE category = 'pediatria';

-- 3) Verifica el resultado.
-- SELECT id, title, category, image FROM content_guide ORDER BY id;
