package com.mediguard.usuario.user.service;

import com.mediguard.usuario.user.dto.ProfileResponse;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    public ProfileResponse getCurrentProfile() {
        // TODO: leer usuario autenticado desde SecurityContext cuando JWT este definido.
        throw new ResponseStatusException(
                HttpStatus.NOT_IMPLEMENTED,
                "Perfil pendiente hasta confirmar autenticacion y mapeo de usuario."
        );
    }
}
