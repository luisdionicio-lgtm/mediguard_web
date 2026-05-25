package com.mediguard.usuario.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record EmergencyResponse(
        Long id,
        String name,
        String phone,
        String category,
        @JsonProperty("country_code")
        String countryCode,
        Integer priority
) {
}
