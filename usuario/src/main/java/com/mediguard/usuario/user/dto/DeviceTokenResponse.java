package com.mediguard.usuario.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.OffsetDateTime;
import java.util.UUID;

public record DeviceTokenResponse(
        UUID id,
        String provider,
        String platform,
        @JsonProperty("device_name")
        String deviceName,
        boolean active,
        @JsonProperty("token_preview")
        String tokenPreview,
        @JsonProperty("created_at")
        OffsetDateTime createdAt,
        @JsonProperty("updated_at")
        OffsetDateTime updatedAt,
        @JsonProperty("last_seen_at")
        OffsetDateTime lastSeenAt
) {
}
