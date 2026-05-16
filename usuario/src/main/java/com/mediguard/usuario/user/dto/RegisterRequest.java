package com.mediguard.usuario.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @JsonProperty("first_name")
        @NotBlank String firstName,
        @JsonProperty("last_name")
        @NotBlank String lastName,
        @Email @NotBlank String email,
        @NotBlank String phone,
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        @NotBlank String password
) {
}
