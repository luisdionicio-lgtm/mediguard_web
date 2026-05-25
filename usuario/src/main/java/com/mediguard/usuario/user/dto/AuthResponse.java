package com.mediguard.usuario.user.dto;

public record AuthResponse(
        String accessToken,
        String refreshToken,
        ProfileResponse user
) {
}
