package com.mediguard.usuario.aprendizaje.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import org.hibernate.annotations.Immutable;

/** Referencia de solo lectura al catálogo administrado por Django. */
@Immutable
@Entity
@Table(name = "courses")
public class CatalogCourseEntity {

    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "is_published", nullable = false)
    private boolean published;

    @Column(nullable = false)
    private String title;

    protected CatalogCourseEntity() {
    }

    public UUID getId() {
        return id;
    }

    public boolean isPublished() {
        return published;
    }

    public String getTitle() {
        return title;
    }
}
