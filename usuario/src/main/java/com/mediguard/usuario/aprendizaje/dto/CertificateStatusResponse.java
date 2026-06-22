package com.mediguard.usuario.aprendizaje.dto;

public record CertificateStatusResponse(
        boolean available,
        String message,
        CertificateResponse certificate
) {
}
