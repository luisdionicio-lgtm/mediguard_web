package com.mediguard.usuario.user.service;

import com.mediguard.usuario.user.dto.ProfileResponse;
import com.mediguard.usuario.user.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional(readOnly = true)
public class ProfileService {

    private final UserRepository userRepository;
    private final ProfileMapper profileMapper;

    public ProfileService(UserRepository userRepository, ProfileMapper profileMapper) {
        this.userRepository = userRepository;
        this.profileMapper = profileMapper;
    }

    public ProfileResponse getCurrentProfile() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Autenticación requerida.");
        }

        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .filter(user -> Boolean.TRUE.equals(user.getActive()))
                .map(profileMapper::toResponse)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Usuario no encontrado."));
    }
}
