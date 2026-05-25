package com.mediguard.usuario.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.OffsetDateTime;

public record EmergencyContactResponse(
        Long id,
        String name,
        String phone,
        String relationship,
        @JsonProperty("is_primary")
        Boolean primary,
        String email,
        String notes,
        @JsonProperty("created_at")
        OffsetDateTime createdAt,
        @JsonProperty("updated_at")
        OffsetDateTime updatedAt
) {
}
