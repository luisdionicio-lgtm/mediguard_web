package com.mediguard.usuario.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

public record SosEventResponse(
        Long id,
        String status,
        BigDecimal latitude,
        BigDecimal longitude,
        String notes,
        String device,
        @JsonProperty("approximate_address")
        String approximateAddress,
        @JsonProperty("duration_seconds")
        Integer durationSeconds,
        @JsonProperty("notified_contacts")
        Integer notifiedContacts,
        @JsonProperty("activated_at")
        OffsetDateTime activatedAt,
        @JsonProperty("resolved_at")
        OffsetDateTime resolvedAt
) {
}
