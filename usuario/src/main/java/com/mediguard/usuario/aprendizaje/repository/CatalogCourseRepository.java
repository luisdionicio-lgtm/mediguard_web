package com.mediguard.usuario.aprendizaje.repository;

import com.mediguard.usuario.aprendizaje.entity.CatalogCourseEntity;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CatalogCourseRepository extends JpaRepository<CatalogCourseEntity, UUID> {

    boolean existsByIdAndPublishedTrue(UUID id);
}
