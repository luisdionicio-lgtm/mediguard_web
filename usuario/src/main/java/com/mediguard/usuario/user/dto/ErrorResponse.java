package com.mediguard.usuario.user.dto;

import java.util.List;
import java.util.Map;

public record ErrorResponse(
        String message,
        Map<String, List<String>> errors
) {
}
