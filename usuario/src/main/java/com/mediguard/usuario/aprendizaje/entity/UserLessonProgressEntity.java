package com.mediguard.usuario.aprendizaje.entity;

import jakarta.persistence.*;

import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "user_lesson_progress")
public class UserLessonProgressEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false)
    private EnrollmentEntity enrollment;

    // FK a lessons (Django managed) — solo UUID
    @Column(name = "lesson_id", nullable = false, columnDefinition = "uuid")
    private UUID lessonId;

    @Column(nullable = false)
    private boolean completed = false;

    @Column(columnDefinition = "INTEGER CHECK (score BETWEEN 0 AND 100)")
    private Integer score;

    @Column(nullable = false)
    private int attempts = 0;

    @Column(name = "last_seen_at", nullable = false)
    private Instant lastSeenAt;

    public UserLessonProgressEntity() {
    }

    public UUID getId() {
        return id;
    }

    public EnrollmentEntity getEnrollment() {
        return enrollment;
    }

    public UUID getLessonId() {
        return lessonId;
    }

    public boolean isCompleted() {
        return completed;
    }

    public Integer getScore() {
        return score;
    }

    public int getAttempts() {
        return attempts;
    }

    public Instant getLastSeenAt() {
        return lastSeenAt;
    }

    public void setEnrollment(EnrollmentEntity enrollment) {
        this.enrollment = enrollment;
    }

    public void setLessonId(UUID lessonId) {
        this.lessonId = lessonId;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }

    public void setScore(Integer score) {
        this.score = score;
    }

    public void setAttempts(int attempts) {
        this.attempts = attempts;
    }

    public void setLastSeenAt(Instant lastSeenAt) {
        this.lastSeenAt = lastSeenAt;
    }
}
