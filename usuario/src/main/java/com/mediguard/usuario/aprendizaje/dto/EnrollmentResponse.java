package com.mediguard.usuario.aprendizaje.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.util.UUID;

public record EnrollmentResponse(
        UUID id,
        UUID user,
        UUID course,
        @JsonProperty("course_id") UUID courseId,
        @JsonProperty("enrolled_at") Instant enrolledAt,
        @JsonProperty("completed_at") Instant completedAt,
        @JsonProperty("already_enrolled") boolean alreadyEnrolled
) {
}
