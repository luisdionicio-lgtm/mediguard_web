package com.mediguard.usuario.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import java.util.List;

public record ProfileUpdateRequest(
        @JsonProperty("first_name")
        @Size(max = 100, message = "El nombre no puede superar 100 caracteres.")
        String firstName,

        @JsonProperty("last_name")
        @Size(max = 100, message = "El apellido no puede superar 100 caracteres.")
        String lastName,

        @Pattern(
                regexp = "^$|^\\+?\\d{7,15}$",
                message = "El teléfono debe contener entre 7 y 15 dígitos y puede iniciar con +.")
        String phone,

        List<String> roles,
        String email,
        String password,
        @JsonProperty("password_hash") String passwordHash
) {
}
