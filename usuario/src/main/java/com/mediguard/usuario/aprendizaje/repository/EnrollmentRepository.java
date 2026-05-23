package com.mediguard.usuario.aprendizaje.repository;

import com.mediguard.usuario.aprendizaje.entity.EnrollmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface EnrollmentRepository extends JpaRepository<EnrollmentEntity, UUID> {

    // user_id → user.id (campo FK); underscore fuerza traversal explícito en Spring Data
    Optional<EnrollmentEntity> findByUser_IdAndCourseId(UUID userId, UUID courseId);

    boolean existsByUser_IdAndCourseId(UUID userId, UUID courseId);
}
