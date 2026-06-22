package com.mediguard.usuario.aprendizaje.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

public record CompleteLessonRequest(
        @NotNull(message = "La inscripción es obligatoria.")
        @JsonProperty("enrollment_id") UUID enrollmentId,

        @Min(value = 0, message = "El puntaje mínimo es 0.")
        @Max(value = 100, message = "El puntaje máximo es 100.")
        Integer score
) {
}
