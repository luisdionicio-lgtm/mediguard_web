package com.mediguard.usuario.user.controller;

import com.mediguard.usuario.user.entity.Usuario;
import com.mediguard.usuario.user.repository.UsuarioRepository;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioRepository usuarioRepository;

    public UsuarioController(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/registro")
    public ResponseEntity<?> registrar(@RequestBody Usuario usuario) {
        if (usuarioRepository.findByEmail(usuario.getEmail()).isPresent()) {
            Map<String, String> error = new HashMap<>();
            error.put("error", "El correo ya está registrado.");
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
        }
        
        Usuario guardado = usuarioRepository.save(usuario);
        
        Map<String, Object> response = new HashMap<>();
        response.put("user", guardado);
        response.put("access", "dummy-jwt-token-for-frontend");
        response.put("refresh", "dummy-refresh-token-for-frontend");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Usuario credenciales) {
        Optional<Usuario> userOpt = usuarioRepository.findByEmail(credenciales.getEmail());
        
        if (userOpt.isPresent() && userOpt.get().getContrasena().equals(credenciales.getContrasena())) {
            Usuario usuario = userOpt.get();
            Map<String, Object> response = new HashMap<>();
            response.put("user", usuario);
            response.put("access", "dummy-jwt-token-for-frontend");
            response.put("refresh", "dummy-refresh-token-for-frontend");
            return ResponseEntity.ok(response);
        }
        
        Map<String, String> error = new HashMap<>();
        error.put("error", "Credenciales incorrectas");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error);
    }
}
