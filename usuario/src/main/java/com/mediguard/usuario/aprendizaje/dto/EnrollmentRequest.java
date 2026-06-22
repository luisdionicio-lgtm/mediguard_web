package com.mediguard.usuario.aprendizaje.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record EnrollmentRequest(
        @NotNull(message = "El curso es obligatorio.")
        @JsonProperty("course_id") UUID courseId
) {
}
