package com.mediguard.usuario.aprendizaje.repository;

import com.mediguard.usuario.aprendizaje.entity.CertificateEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CertificateRepository extends JpaRepository<CertificateEntity, UUID> {

    Optional<CertificateEntity> findByEnrollmentId(UUID enrollmentId);
}
