package com.mediguard.usuario.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ResetPasswordRequest(
        @NotBlank(message = "El token es obligatorio.") String token,

        @JsonProperty("new_password")
        @NotBlank(message = "La nueva contraseña es obligatoria.")
        @Size(min = 8, message = "La nueva contraseña debe tener al menos 8 caracteres.")
        String newPassword
) {
}
