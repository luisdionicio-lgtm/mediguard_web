package com.mediguard.usuario.aprendizaje.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Immutable;

import java.time.Instant;
import java.util.UUID;

/**
 * Solo lectura — emitido exclusivamente por fn_auto_issue_certificate.
 * Spring Boot nunca hace INSERT ni UPDATE en esta tabla.
 * @Immutable impide que Hibernate registre cambios accidentales en el contexto de persistencia.
 */
@Immutable
@Entity
@Table(name = "certificates")
public class CertificateEntity {

    @Id
    // PostgreSQL genera el UUID con DEFAULT gen_random_uuid() — Hibernate solo lee
    @Column(columnDefinition = "uuid", insertable = false, updatable = false, nullable = false)
    private UUID id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "enrollment_id", nullable = false, unique = true,
                insertable = false, updatable = false)
    private EnrollmentEntity enrollment;

    @Column(nullable = false, unique = true, length = 64,
            insertable = false, updatable = false)
    private String code;

    @Column(name = "issued_at", nullable = false,
            insertable = false, updatable = false)
    private Instant issuedAt;

    protected CertificateEntity() {}

    public UUID getId()                    { return id; }
    public EnrollmentEntity getEnrollment(){ return enrollment; }
    public String getCode()                { return code; }
    public Instant getIssuedAt()           { return issuedAt; }
}
