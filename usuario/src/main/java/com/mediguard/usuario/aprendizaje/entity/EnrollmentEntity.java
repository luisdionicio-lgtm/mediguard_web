package com.mediguard.usuario.aprendizaje.entity;

import com.mediguard.usuario.user.entity.UserEntity;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "enrollments")
public class EnrollmentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    // FK a courses (Django managed) — no se carga como entidad JPA
    @Column(name = "course_id", nullable = false, columnDefinition = "uuid")
    private UUID courseId;

    @CreationTimestamp
    @Column(name = "enrolled_at", updatable = false, nullable = false)
    private Instant enrolledAt;

    // Llenado por trigger trg_auto_issue_certificate — Spring Boot nunca lo escribe
    @Column(name = "completed_at", insertable = false, updatable = false)
    private Instant completedAt;

    protected EnrollmentEntity() {}

    public EnrollmentEntity(UserEntity user, UUID courseId) {
        this.user     = user;
        this.courseId = courseId;
    }

    public UUID getId()            { return id; }
    public UserEntity getUser()    { return user; }
    public UUID getCourseId()      { return courseId; }
    public Instant getEnrolledAt() { return enrolledAt; }
    public Instant getCompletedAt(){ return completedAt; }
}
