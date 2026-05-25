package com.mediguard.usuario.user.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.time.OffsetDateTime;

public record NewsResponse(
        Long id,
        String title,
        String summary,
        String content,
        @JsonProperty("published_date")
        OffsetDateTime publishedDate
) {
}
