package com.mediguard.usuario.aprendizaje.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.UUID;
import org.hibernate.annotations.Immutable;

/** Referencia de solo lectura a las lecciones administradas por Django. */
@Immutable
@Entity
@Table(name = "lessons")
public class CatalogLessonEntity {

    @Id
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "course_id", nullable = false, columnDefinition = "uuid")
    private UUID courseId;

    protected CatalogLessonEntity() {
    }

    public UUID getId() {
        return id;
    }

    public UUID getCourseId() {
        return courseId;
    }
}
