package com.mediguard.usuario.aprendizaje.repository;

import com.mediguard.usuario.aprendizaje.entity.CatalogLessonEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatalogLessonRepository extends JpaRepository<CatalogLessonEntity, UUID> {

    boolean existsByIdAndCourseId(UUID id, UUID courseId);
}
