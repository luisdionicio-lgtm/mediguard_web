package com.mediguard.usuario.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;

public record GoogleAuthRequest(
        @NotBlank
        @JsonProperty("access_token")
        String accessToken
) {
}
