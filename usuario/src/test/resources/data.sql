INSERT INTO roles (id, name, description, created_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'CIUDADANO', 'Usuario estándar del sistema', CURRENT_TIMESTAMP);

INSERT INTO roles (id, name, description, created_at)
VALUES ('00000000-0000-0000-0000-000000000002', 'SOCORRISTA', 'Personal de primera respuesta', CURRENT_TIMESTAMP);

INSERT INTO roles (id, name, description, created_at)
VALUES ('00000000-0000-0000-0000-000000000003', 'COORDINADOR', 'Coordinador operativo', CURRENT_TIMESTAMP);

INSERT INTO roles (id, name, description, created_at)
VALUES ('00000000-0000-0000-0000-000000000004', 'ADMIN', 'Administrador del sistema', CURRENT_TIMESTAMP);

INSERT INTO courses (id, is_published, title)
VALUES ('10000000-0000-0000-0000-000000000001', TRUE, 'Curso de prueba publicado');

INSERT INTO courses (id, is_published, title)
VALUES ('10000000-0000-0000-0000-000000000002', FALSE, 'Curso de prueba sin publicar');

INSERT INTO lessons (id, course_id)
VALUES ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001');

INSERT INTO lessons (id, course_id)
VALUES ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001');

INSERT INTO lessons (id, course_id)
VALUES ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000002');
