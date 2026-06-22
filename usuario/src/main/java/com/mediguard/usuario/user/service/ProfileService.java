package com.mediguard.usuario.user.service;

import com.mediguard.usuario.user.dto.ProfileResponse;
import com.mediguard.usuario.user.dto.ProfileUpdateRequest;
import com.mediguard.usuario.user.entity.UserEntity;
import com.mediguard.usuario.user.exception.ApiFieldException;
import com.mediguard.usuario.user.repository.UserRepository;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileService {

    private final UserRepository userRepository;
    private final ProfileMapper profileMapper;

    public ProfileService(UserRepository userRepository, ProfileMapper profileMapper) {
        this.userRepository = userRepository;
        this.profileMapper = profileMapper;
    }

    @Transactional(readOnly = true)
    public ProfileResponse getCurrentProfile() {
        return profileMapper.toResponse(getCurrentUser());
    }

    @Transactional
    public ProfileResponse updateCurrentProfile(ProfileUpdateRequest request) {
        rejectProtectedFields(request);
        UserEntity user = getCurrentUser();

        if (request.firstName() != null) {
            user.setFirstName(requiredTrimmed(request.firstName(), "first_name", "El nombre no puede estar vacío."));
        }
        if (request.lastName() != null) {
            user.setLastName(requiredTrimmed(request.lastName(), "last_name", "El apellido no puede estar vacío."));
        }
        if (request.phone() != null) {
            String phone = request.phone().trim();
            String normalizedPhone = phone.isEmpty() ? null : phone;
            if (normalizedPhone != null
                    && !normalizedPhone.equals(user.getPhone())
                    && userRepository.existsByPhone(normalizedPhone)) {
                throw fieldError("phone", "El teléfono ya está registrado.");
            }
            user.setPhone(normalizedPhone);
        }

        return profileMapper.toResponse(userRepository.save(user));
    }

    private UserEntity getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Autenticación requerida.");
        }

        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .filter(user -> Boolean.TRUE.equals(user.getActive()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Usuario no encontrado."));
    }

    private void rejectProtectedFields(ProfileUpdateRequest request) {
        Map<String, List<String>> errors = new LinkedHashMap<>();
        if (request.roles() != null) {
            errors.put("roles", List.of("Los roles no se pueden modificar desde el perfil."));
        }
        if (request.email() != null) {
            errors.put("email", List.of("El email no se puede modificar desde este endpoint."));
        }
        if (request.password() != null || request.passwordHash() != null) {
            errors.put("password", List.of("La contraseña no se puede modificar desde este endpoint."));
        }
        if (!errors.isEmpty()) {
            throw new ApiFieldException(HttpStatus.BAD_REQUEST, "Campos no permitidos", errors);
        }
    }

    private String requiredTrimmed(String value, String field, String message) {
        String trimmed = value.trim();
        if (trimmed.isEmpty()) {
            throw fieldError(field, message);
        }
        return trimmed;
    }

    private ApiFieldException fieldError(String field, String message) {
        return new ApiFieldException(
                HttpStatus.BAD_REQUEST,
                "Error de validación",
                Map.of(field, List.of(message)));
    }
}
