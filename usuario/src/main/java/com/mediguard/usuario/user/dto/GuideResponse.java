package com.mediguard.usuario.user.dto;

public record GuideResponse(
        Long id,
        String title,
        String description,
        String category,
        String content
) {
}
