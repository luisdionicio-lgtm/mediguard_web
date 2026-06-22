package com.mediguard.usuario.aprendizaje.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.Instant;
import java.util.UUID;

public record ProgressResponse(
        UUID id,
        @JsonProperty("enrollment_id") UUID enrollmentId,
        @JsonProperty("lesson_id") UUID lessonId,
        boolean completed,
        Integer score,
        int attempts,
        @JsonProperty("last_seen_at") Instant lastSeenAt
) {
}
