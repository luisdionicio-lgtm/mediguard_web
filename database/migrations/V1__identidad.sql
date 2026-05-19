-- =============================================================================
-- V1__identidad.sql  —  Sprint 1: Identidad
-- Tablas: roles, users, user_roles, verification_tokens, audit_log
-- Fuente de verdad: PostgreSQL. Nunca generar DDL desde Django ni Spring Boot.
-- =============================================================================

-- ─── Extensiones ─────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "pgcrypto";   -- gen_random_bytes, gen_random_uuid


-- ─── ENUMs ───────────────────────────────────────────────────────────────────
DO $$ BEGIN
    CREATE TYPE token_type_enum AS ENUM (
        'EMAIL_VERIFICATION',
        'PASSWORD_RESET',
        'PHONE_VERIFICATION'
    );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;


-- =============================================================================
-- TABLA: roles
-- Dueño: Django (managed=True). Spring Boot solo referencia.
-- =============================================================================
CREATE TABLE IF NOT EXISTS roles (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Roles iniciales del sistema
INSERT INTO roles (name, description) VALUES
    ('CIUDADANO',   'Usuario ciudadano estándar — asignado automáticamente al registrarse'),
    ('SOCORRISTA',  'Personal de primeros auxilios certificado'),
    ('COORDINADOR', 'Coordinador de emergencias'),
    ('ADMIN',       'Administrador del sistema')
ON CONFLICT (name) DO NOTHING;


-- =============================================================================
-- TABLA: users
-- Dueño: Spring Boot (managed=False en Django).
-- Django la referencia como AUTH_USER_MODEL durante la transición.
-- =============================================================================
CREATE TABLE IF NOT EXISTS users (
    id             UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    first_name     VARCHAR(100) NOT NULL,
    last_name      VARCHAR(100) NOT NULL,
    email          VARCHAR(255) NOT NULL UNIQUE,
    phone          VARCHAR(20)  UNIQUE,
    password_hash  VARCHAR(255) NOT NULL,
    avatar_url     VARCHAR(500),
    bio            TEXT,
    is_active      BOOLEAN     NOT NULL DEFAULT TRUE,
    is_verified    BOOLEAN     NOT NULL DEFAULT FALSE,
    last_login_at  TIMESTAMPTZ,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT now(),

    CONSTRAINT chk_email_format
        CHECK (email ~* '^[A-Za-z0-9._%+\-]+@[A-Za-z0-9.\-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_phone_format
        CHECK (phone IS NULL OR phone ~* '^\+?\d{7,15}$')
);

CREATE INDEX IF NOT EXISTS idx_users_email     ON users (email);
CREATE INDEX IF NOT EXISTS idx_users_is_active ON users (is_active) WHERE is_active = TRUE;


-- =============================================================================
-- TABLA: user_roles  (tabla pivote)
-- Dueño: Spring Boot. Django la referencia con managed=False.
-- =============================================================================
CREATE TABLE IF NOT EXISTS user_roles (
    user_id     UUID NOT NULL REFERENCES users(id)  ON DELETE CASCADE,
    role_id     UUID NOT NULL REFERENCES roles(id)  ON DELETE RESTRICT,
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    assigned_by UUID        REFERENCES users(id)    ON DELETE SET NULL,
    PRIMARY KEY (user_id, role_id)
);

CREATE INDEX IF NOT EXISTS idx_user_roles_user ON user_roles (user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role ON user_roles (role_id);


-- =============================================================================
-- TABLA: verification_tokens
-- Dueño: Spring Boot. Django la referencia con managed=False.
-- =============================================================================
CREATE TABLE IF NOT EXISTS verification_tokens (
    id          UUID             PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID             NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token       VARCHAR(255)     NOT NULL UNIQUE
                                 DEFAULT encode(gen_random_bytes(32), 'hex'),
    token_type  token_type_enum  NOT NULL,
    expires_at  TIMESTAMPTZ      NOT NULL DEFAULT (now() + INTERVAL '24 hours'),
    used        BOOLEAN          NOT NULL DEFAULT FALSE,
    created_at  TIMESTAMPTZ      NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tokens_user_id ON verification_tokens (user_id);
CREATE INDEX IF NOT EXISTS idx_tokens_token
    ON verification_tokens (token) WHERE used = FALSE;


-- =============================================================================
-- TABLA: audit_log
-- Dueño: Django (managed=True). Spring Boot la referencia.
-- =============================================================================
CREATE TABLE IF NOT EXISTS audit_log (
    id          UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID        REFERENCES users(id) ON DELETE SET NULL,
    action      VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id   UUID,
    metadata    JSONB,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_user_id ON audit_log (user_id);
CREATE INDEX IF NOT EXISTS idx_audit_action  ON audit_log (action);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log (created_at DESC);


-- =============================================================================
-- TRIGGERS
-- =============================================================================

-- ── Trigger 1: actualizar updated_at en users ─────────────────────────────────
CREATE OR REPLACE FUNCTION fn_users_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
CREATE TRIGGER trg_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION fn_users_updated_at();


-- ── Trigger 2: asignar rol CIUDADANO al crear usuario ─────────────────────────
-- El cliente (Spring Boot o Django) hace INSERT normal en users;
-- PostgreSQL asigna el rol automáticamente sin lógica adicional en el backend.
CREATE OR REPLACE FUNCTION fn_assign_default_role()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
DECLARE
    v_role_id UUID;
BEGIN
    SELECT id INTO v_role_id FROM roles WHERE name = 'CIUDADANO';
    IF v_role_id IS NOT NULL THEN
        INSERT INTO user_roles (user_id, role_id)
        VALUES (NEW.id, v_role_id)
        ON CONFLICT DO NOTHING;
    END IF;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_assign_default_role ON users;
CREATE TRIGGER trg_assign_default_role
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION fn_assign_default_role();


-- =============================================================================
-- VERIFICACIÓN (ejecutar al final para confirmar)
-- =============================================================================
-- SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename;
-- SELECT proname FROM pg_proc WHERE proname LIKE 'fn_%';
-- SELECT tgname FROM pg_trigger WHERE tgname LIKE 'trg_%';
