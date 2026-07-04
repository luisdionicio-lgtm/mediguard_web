package com.mediguard.usuario.user.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record ForgotPasswordRequest(
        @Email(message = "El formato del correo no es válido.")
        @NotBlank(message = "El correo es obligatorio.") String email
) {
}
