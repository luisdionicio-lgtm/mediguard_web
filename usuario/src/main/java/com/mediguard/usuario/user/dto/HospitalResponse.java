package com.mediguard.usuario.user.dto;

public record HospitalResponse(
        Long id,
        String name,
        String address,
        String phone,
        Double latitude,
        Double longitude
) {
}
