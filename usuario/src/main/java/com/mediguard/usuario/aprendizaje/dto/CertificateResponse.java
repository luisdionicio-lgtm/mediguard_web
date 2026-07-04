package com.mediguard.usuario.aprendizaje.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.util.UUID;

public record CertificateResponse(
        UUID id,
        @JsonProperty("enrollment_id") UUID enrollmentId,
        String code,
        @JsonProperty("issued_at") Instant issuedAt
) {
}
