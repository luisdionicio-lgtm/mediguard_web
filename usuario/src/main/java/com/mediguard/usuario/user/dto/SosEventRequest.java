package com.mediguard.usuario.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import java.math.BigDecimal;

public record SosEventRequest(
        String status,
        @DecimalMin("-90.0")
        @DecimalMax("90.0")
        BigDecimal latitude,
        @DecimalMin("-180.0")
        @DecimalMax("180.0")
        BigDecimal longitude,
        String notes,
        String device,
        @JsonProperty("approximate_address")
        String approximateAddress,
        @JsonProperty("notified_contacts")
        @Min(0)
        Integer notifiedContacts
) {
}
