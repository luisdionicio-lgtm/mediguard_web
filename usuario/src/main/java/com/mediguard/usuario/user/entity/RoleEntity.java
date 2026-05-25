package com.mediguard.usuario.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

/**
 * Referencia de solo lectura a la tabla 'roles'.
 * Dueño real: Django (managed=True). Spring Boot solo lee para construir relaciones.
 */
@Entity
@Table(name = "roles")
public class RoleEntity {

    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(unique = true, nullable = false, length = 50)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;

    protected RoleEntity() {
    }

    public UUID getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public Instant getCreatedAt() { return createdAt; }
}
