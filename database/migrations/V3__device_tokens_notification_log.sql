-- =============================================================================
-- V3__device_tokens_notification_log.sql
-- Tokens móviles y auditoría de intentos de notificación SOS.
-- PostgreSQL sigue siendo la fuente de verdad; Spring usa ddl-auto=none.
-- =============================================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS user_device_tokens (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider    VARCHAR(20)  NOT NULL,
    token       VARCHAR(512) NOT NULL,
    platform    VARCHAR(20)  NOT NULL,
    device_name VARCHAR(120),
    active      BOOLEAN      NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ  NOT NULL DEFAULT now(),
    last_seen_at TIMESTAMPTZ NOT NULL DEFAULT now(),

    UNIQUE (provider, token)
);

CREATE INDEX IF NOT EXISTS idx_device_tokens_user
    ON user_device_tokens (user_id, active);

CREATE TABLE IF NOT EXISTS notification_log (
    id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    sos_event_id         BIGINT      NOT NULL REFERENCES emergency_eventosos(id) ON DELETE CASCADE,
    recipient_user_id    UUID        REFERENCES users(id) ON DELETE SET NULL,
    emergency_contact_id BIGINT      REFERENCES emergency_contactoemergencia(id) ON DELETE SET NULL,
    channel              VARCHAR(20) NOT NULL,
    provider             VARCHAR(20) NOT NULL,
    status               VARCHAR(20) NOT NULL,
    message              TEXT        NOT NULL DEFAULT '',
    provider_response    TEXT,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    sent_at              TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_notification_log_sos
    ON notification_log (sos_event_id, created_at);

CREATE INDEX IF NOT EXISTS idx_notification_log_status
    ON notification_log (status, created_at);

CREATE OR REPLACE FUNCTION fn_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN
    NEW.updated_at := now();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_user_device_tokens_updated_at ON user_device_tokens;
CREATE TRIGGER trg_user_device_tokens_updated_at
    BEFORE UPDATE ON user_device_tokens
    FOR EACH ROW EXECUTE FUNCTION fn_set_updated_at();
