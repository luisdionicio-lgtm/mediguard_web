package com.mediguard.usuario.user.service;

import com.mediguard.usuario.user.dto.AuthResponse;
import com.mediguard.usuario.user.dto.LoginRequest;
import com.mediguard.usuario.user.dto.MessageResponse;
import com.mediguard.usuario.user.dto.RegisterRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {

    public AuthResponse login(LoginRequest request) {
        // TODO: validar contra el esquema real compartido con Django y emitir JWT compatible.
        throw pending();
    }

    public AuthResponse register(RegisterRequest request) {
        // TODO: crear usuario sin exponer password y respetando tablas reales administradas por Django.
        throw pending();
    }

    public MessageResponse logout() {
        // TODO: definir estrategia de invalidacion de token para Spring Boot.
        throw pending();
    }

    private ResponseStatusException pending() {
        return new ResponseStatusException(
                HttpStatus.NOT_IMPLEMENTED,
                "Endpoint pendiente hasta confirmar esquema PostgreSQL y contrato de autenticacion."
        );
    }
}
