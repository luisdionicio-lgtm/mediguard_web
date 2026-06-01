package com.mediguard.usuario.user.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/usuarios")
@Deprecated
public class UsuarioController {

    @PostMapping("/registro")
    public ResponseEntity<?> registrar() {
        return legacyEndpoint();
    }

    @PostMapping("/login")
    public ResponseEntity<?> login() {
        return legacyEndpoint();
    }

    private ResponseEntity<?> legacyEndpoint() {
        return ResponseEntity.status(HttpStatus.GONE).body(Map.of(
                "error", "Legacy endpoint disabled. Use /api/login/ and /api/register/."));
    }
}
