package com.mediguard.usuario.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.util.UUID;

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
        OffsetDateTime resolvedAt,
        @JsonProperty("user_id")
        UUID userId,
        @JsonProperty("location_available")
        boolean locationAvailable,
        @JsonProperty("contacts_found")
        int contactsFound,
        @JsonProperty("notifiable_contacts")
        int notifiableContacts,
        @JsonProperty("simulated_contacts")
        int simulatedContacts,
        @JsonProperty("real_notification_enabled")
        boolean realNotificationEnabled,
        @JsonProperty("notification_status")
        String notificationStatus,
        @JsonProperty("notification_message")
        String notificationMessage
) {
}
