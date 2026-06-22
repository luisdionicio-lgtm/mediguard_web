package com.mediguard.usuario.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record EmergencyContactRequest(
        @NotBlank(message = "El nombre del contacto es obligatorio.") String name,
        @NotBlank(message = "El teléfono del contacto es obligatorio.")
        @Pattern(regexp = "^\\+?\\d{7,15}$", message = "El teléfono debe usar formato internacional.")
        String phone,
        @Pattern(
                regexp = "^(?i:familiar|amigo|medico|vecino|otro)$",
                message = "La relación del contacto no es válida.")
        String relationship,
        @JsonProperty("is_primary")
        Boolean primary,
        @Email(message = "El formato del correo no es válido.") String email,
        String notes
) {
}
