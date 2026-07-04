package com.mediguard.usuario.aprendizaje.repository;

import com.mediguard.usuario.aprendizaje.entity.UserLessonProgressEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.List;
import java.util.UUID;

public interface UserLessonProgressRepository extends JpaRepository<UserLessonProgressEntity, UUID> {

    Optional<UserLessonProgressEntity> findByEnrollmentIdAndLessonId(UUID enrollmentId, UUID lessonId);

    List<UserLessonProgressEntity> findAllByEnrollmentIdOrderByLastSeenAtAsc(UUID enrollmentId);
}
