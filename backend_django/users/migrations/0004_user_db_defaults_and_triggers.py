# -*- coding: utf-8 -*-
from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_add_user_profile_fields'),
    ]

    operations = [
        migrations.RunSQL(
            sql="""
                UPDATE users
                SET updated_at = COALESCE(updated_at, created_at, now())
                WHERE updated_at IS NULL;

                ALTER TABLE users
                ALTER COLUMN updated_at SET DEFAULT now();

                ALTER TABLE user_roles
                ALTER COLUMN assigned_at SET DEFAULT now();

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
            """,
            reverse_sql="""
                DROP TRIGGER IF EXISTS trg_assign_default_role ON users;
                DROP FUNCTION IF EXISTS fn_assign_default_role();

                DROP TRIGGER IF EXISTS trg_users_updated_at ON users;
                DROP FUNCTION IF EXISTS fn_users_updated_at();

                ALTER TABLE user_roles
                ALTER COLUMN assigned_at DROP DEFAULT;

                ALTER TABLE users
                ALTER COLUMN updated_at DROP DEFAULT;
            """,
        ),
    ]
