-- =============================================================================
-- V2__categorias_cursos.sql  —  Sprint 2: Categorías y Cursos
-- Tablas: categories, courses, lessons, quizzes, course_ratings,
--         enrollments, user_lesson_progress, certificates
-- Fuente de verdad: PostgreSQL. Nunca generar DDL desde Django ni Spring Boot.
-- =============================================================================

-- Requerida por gen_random_bytes(), usado para generar códigos de certificado.
CREATE EXTENSION IF NOT EXISTS pgcrypto;


-- ─── ENUMs ───────────────────────────────────────────────────────────────────
DO $$ BEGIN
    CREATE TYPE course_level_enum AS ENUM ('BASICO', 'INTERMEDIO', 'AVANZADO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
    CREATE TYPE media_type_enum AS ENUM ('VIDEO', 'AUDIO', 'PDF', 'IMAGEN', 'NINGUNO');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- =============================================================================
-- TABLA: categories
-- Dueño: Django (managed=True). Spring Boot solo referencia.
-- =============================================================================
CREATE TABLE IF NOT EXISTS categories (
    id         UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    name       VARCHAR(100) NOT NULL UNIQUE,
    slug       VARCHAR(100) NOT NULL UNIQUE,
    parent_id  UUID         REFERENCES categories(id) ON DELETE SET NULL,
    icon_url   VARCHAR(500),
    created_at TIMESTAMPTZ  NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug      ON categories (slug);
CREATE INDEX IF NOT EXISTS idx_categories_parent_id ON categories (parent_id);


-- =============================================================================
-- TABLA: courses
-- Dueño: Django (managed=True). Spring Boot referencia courseId como UUID.
-- =============================================================================
CREATE TABLE IF NOT EXISTS courses (
    id            UUID               PRIMARY KEY DEFAULT gen_random_uuid(),
    category_id   UUID               REFERENCES categories(id) ON DELETE SET NULL,
    author_id     UUID               NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    title         VARCHAR(255)       NOT NULL,
    slug          VARCHAR(255)       NOT NULL UNIQUE,
    description   TEXT,
    thumbnail_url VARCHAR(500),
    level         course_level_enum  NOT NULL DEFAULT 'BASICO',
    duration_min  INTEGER            NOT NULL DEFAULT 0,  -- actualizado por trigger
    is_published  BOOLEAN            NOT NULL DEFAULT FALSE,
    published_at  TIMESTAMPTZ,
    created_at    TIMESTAMPTZ        NOT NULL DEFAULT now(),
    updated_at    TIMESTAMPTZ        NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_courses_slug        ON courses (slug);
CREATE INDEX IF NOT EXISTS idx_courses_category_id ON courses (category_id);
CREATE INDEX IF NOT EXISTS idx_courses_author_id   ON courses (author_id);
CREATE INDEX IF NOT EXISTS idx_courses_published   ON courses (is_published) WHERE is_published = TRUE;


-- =============================================================================
-- TABLA: lessons
-- Dueño: Django (managed=True).
-- =============================================================================
CREATE TABLE IF NOT EXISTS lessons (
    id           UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id    UUID             NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title        VARCHAR(255)     NOT NULL,
    content      TEXT,
    media_url    VARCHAR(500),
    media_type   media_type_enum  NOT NULL DEFAULT 'NINGUNO',
    order_index  INTEGER          NOT NULL DEFAULT 0,
    duration_min INTEGER          NOT NULL DEFAULT 0,
    is_free      BOOLEAN          NOT NULL DEFAULT FALSE,
    created_at   TIMESTAMPTZ      NOT NULL DEFAULT now(),

    UNIQUE (course_id, order_index)
);

CREATE INDEX IF NOT EXISTS idx_lessons_course_id ON lessons (course_id);


-- =============================================================================
-- TABLA: quizzes
-- Dueño: Django (managed=True).
-- =============================================================================
CREATE TABLE IF NOT EXISTS quizzes (
    id             UUID  PRIMARY KEY DEFAULT gen_random_uuid(),
    lesson_id      UUID  NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
    question       TEXT  NOT NULL,
    options        JSONB NOT NULL,   -- [{"key": "A", "text": "..."}, ...]
    correct_option VARCHAR(5) NOT NULL,
    explanation    TEXT
);

CREATE INDEX IF NOT EXISTS idx_quizzes_lesson_id ON quizzes (lesson_id);


-- =============================================================================
-- TABLA: course_ratings
-- Dueño: Django (managed=True).
-- =============================================================================
CREATE TABLE IF NOT EXISTS course_ratings (
    id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id    UUID        NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    course_id  UUID        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    score      INTEGER     NOT NULL CHECK (score BETWEEN 1 AND 5),
    comment    TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_ratings_course_id ON course_ratings (course_id);
CREATE INDEX IF NOT EXISTS idx_ratings_user_id   ON course_ratings (user_id);


-- =============================================================================
-- TABLA: enrollments
-- Dueño: Spring Boot. Django la referencia con managed=False.
-- =============================================================================
CREATE TABLE IF NOT EXISTS enrollments (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      UUID        NOT NULL REFERENCES users(id)   ON DELETE CASCADE,
    course_id    UUID        NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    enrolled_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    completed_at TIMESTAMPTZ,           -- llenado por trigger al completar todas las lecciones

    UNIQUE (user_id, course_id)
);

CREATE INDEX IF NOT EXISTS idx_enrollments_user_id   ON enrollments (user_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_course_id ON enrollments (course_id);


-- =============================================================================
-- TABLA: user_lesson_progress
-- Dueño: Spring Boot. Django la referencia con managed=False.
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID        NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
    lesson_id     UUID        NOT NULL REFERENCES lessons(id)     ON DELETE CASCADE,
    completed     BOOLEAN     NOT NULL DEFAULT FALSE,
    score         INTEGER     CHECK (score BETWEEN 0 AND 100),
    attempts      INTEGER     NOT NULL DEFAULT 0,
    last_seen_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (enrollment_id, lesson_id)
);

CREATE INDEX IF NOT EXISTS idx_progress_enrollment_id ON user_lesson_progress (enrollment_id);
CREATE INDEX IF NOT EXISTS idx_progress_lesson_id     ON user_lesson_progress (lesson_id);


-- =============================================================================
-- TABLA: certificates
-- Emitidos automáticamente por trigger. Ningún backend inserta directamente.
-- Django la referencia con managed=False.
-- =============================================================================
CREATE TABLE IF NOT EXISTS certificates (
    id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    enrollment_id UUID        NOT NULL UNIQUE REFERENCES enrollments(id) ON DELETE CASCADE,
    code          VARCHAR(64) NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
    issued_at     TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_certificates_enrollment_id ON certificates (enrollment_id);


-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- ── Trigger 1: actualizar updated_at en courses ───────────────────────────────
CREATE OR REPLACE FUNCTION fn_courses_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_courses_updated_at ON courses;
CREATE TRIGGER trg_courses_updated_at
    BEFORE UPDATE ON courses
    FOR EACH ROW EXECUTE FUNCTION fn_courses_updated_at();


-- ── Trigger 2: recalcular duration_min del curso al cambiar lecciones ─────────
CREATE OR REPLACE FUNCTION fn_sum_lesson_duration()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_course_id UUID;
BEGIN
    v_course_id := COALESCE(NEW.course_id, OLD.course_id);
    UPDATE courses
       SET duration_min = (
               SELECT COALESCE(SUM(duration_min), 0)
                 FROM lessons
                WHERE course_id = v_course_id
           )
     WHERE id = v_course_id;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_sum_lesson_duration ON lessons;
CREATE TRIGGER trg_sum_lesson_duration
    AFTER INSERT OR UPDATE OF duration_min OR DELETE ON lessons
    FOR EACH ROW EXECUTE FUNCTION fn_sum_lesson_duration();


-- ── Trigger 3: emitir certificado cuando se completan todas las lecciones ──────
-- Spring Boot hace: UPDATE user_lesson_progress SET completed = TRUE
-- PostgreSQL emite el certificado, registra completed_at y asigna puntos automáticamente.
CREATE OR REPLACE FUNCTION fn_auto_issue_certificate()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_total     INTEGER;
    v_completed INTEGER;
    v_course_id UUID;
BEGIN
    IF NEW.completed = FALSE THEN
        RETURN NEW;
    END IF;

    SELECT e.course_id INTO v_course_id
      FROM enrollments e
     WHERE e.id = NEW.enrollment_id;

    SELECT COUNT(*) INTO v_total
      FROM lessons
     WHERE course_id = v_course_id;

    SELECT COUNT(*) INTO v_completed
      FROM user_lesson_progress
     WHERE enrollment_id = NEW.enrollment_id
       AND completed = TRUE;

    IF v_total > 0 AND v_completed >= v_total THEN
        UPDATE enrollments
           SET completed_at = now()
         WHERE id = NEW.enrollment_id
           AND completed_at IS NULL;

        INSERT INTO certificates (enrollment_id)
        VALUES (NEW.enrollment_id)
        ON CONFLICT (enrollment_id) DO NOTHING;
    END IF;

    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_auto_issue_certificate ON user_lesson_progress;
CREATE TRIGGER trg_auto_issue_certificate
    AFTER INSERT OR UPDATE OF completed ON user_lesson_progress
    FOR EACH ROW EXECUTE FUNCTION fn_auto_issue_certificate();


-- =============================================================================
-- VERIFICACIÓN (ejecutar al final para confirmar)
-- =============================================================================
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
-- SELECT proname FROM pg_proc WHERE proname LIKE 'fn_%' ORDER BY proname;
-- SELECT tgname FROM pg_trigger WHERE tgname LIKE 'trg_%' ORDER BY tgname;
