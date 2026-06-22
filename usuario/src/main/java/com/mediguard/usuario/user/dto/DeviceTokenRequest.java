package com.mediguard.usuario.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record DeviceTokenRequest(
        @NotBlank(message = "El proveedor es obligatorio.")
        @Pattern(regexp = "^(?i:FCM)$", message = "El proveedor debe ser FCM.")
        String provider,

        @NotBlank(message = "El token del dispositivo es obligatorio.")
        @Size(max = 512, message = "El token del dispositivo es demasiado largo.")
        String token,

        @NotBlank(message = "La plataforma es obligatoria.")
        @Pattern(regexp = "^(?i:ANDROID)$", message = "La plataforma debe ser ANDROID.")
        String platform,

        @JsonProperty("device_name")
        @Size(max = 120, message = "El nombre del dispositivo es demasiado largo.")
        String deviceName
) {
}
