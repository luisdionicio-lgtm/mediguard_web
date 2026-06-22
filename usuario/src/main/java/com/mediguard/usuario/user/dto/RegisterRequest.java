package com.mediguard.usuario.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
        @JsonProperty("first_name")
        @NotBlank(message = "El nombre es obligatorio.") String firstName,
        @JsonProperty("last_name")
        @NotBlank(message = "El apellido es obligatorio.") String lastName,
        @Email(message = "El formato del correo no es válido.")
        @NotBlank(message = "El correo es obligatorio.") String email,
        @NotBlank(message = "El teléfono es obligatorio.") String phone,
        @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
        @NotBlank(message = "La contraseña es obligatoria.") String password,
        @JsonProperty("user_type") String userType
) {
}
