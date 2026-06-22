package com.mediguard.usuario.user.service;

import com.mediguard.usuario.user.dto.AuthResponse;
import com.mediguard.usuario.user.dto.LoginRequest;
import com.mediguard.usuario.user.dto.MessageResponse;
import com.mediguard.usuario.user.dto.RegisterRequest;
import com.mediguard.usuario.user.entity.UserEntity;
import com.mediguard.usuario.user.entity.UserRoleEntity;
import com.mediguard.usuario.user.exception.ApiFieldException;
import com.mediguard.usuario.user.repository.RoleRepository;
import com.mediguard.usuario.user.repository.UserRepository;
import com.mediguard.usuario.user.repository.UserRoleRepository;
import com.mediguard.usuario.user.security.JwtService;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class AuthService {

    /**
     * El sistema solo tiene los roles sembrados CIUDADANO/SOCORRISTA/COORDINADOR/ADMIN
     * (ver users/migrations/0002_seed_roles.py). El selector de "tipo de usuario" del
     * registro habla en términos de primeros auxilios, así que lo traducimos al rol
     * más cercano que ya existe en lugar de crear roles nuevos en el esquema compartido.
     */
    private static final Map<String, String> USER_TYPE_TO_ROLE = Map.of(
            "PACIENTE", "CIUDADANO",
            "MEDICO", "COORDINADOR",
            "CUIDADOR", "SOCORRISTA");
    private static final String DEFAULT_ROLE = "CIUDADANO";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordHashService passwordHashService;
    private final JwtService jwtService;
    private final ProfileMapper profileMapper;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            UserRoleRepository userRoleRepository,
            PasswordHashService passwordHashService,
            JwtService jwtService,
            ProfileMapper profileMapper) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordHashService = passwordHashService;
        this.jwtService = jwtService;
        this.profileMapper = profileMapper;
    }

    public AuthResponse login(LoginRequest request) {
        UserEntity user = userRepository.findByEmailIgnoreCase(normalizeEmail(request.email()))
                .orElseThrow(this::invalidCredentials);

        if (!Boolean.TRUE.equals(user.getActive())
                || !passwordHashService.matches(request.password(), user.getPasswordHash())) {
            throw invalidCredentials();
        }

        user.setLastLoginAt(Instant.now());
        UserEntity savedUser = userRepository.save(user);
        return authResponse(savedUser);
    }

    public AuthResponse register(RegisterRequest request) {
        String email = normalizeEmail(request.email());
        String phone = request.phone().trim();

        if (userRepository.existsByEmailIgnoreCase(email)) {
            throw new ApiFieldException(
                    HttpStatus.BAD_REQUEST,
                    "Error de validación",
                    Map.of("email", List.of("El correo ya está registrado.")));
        }
        if (userRepository.existsByPhone(phone)) {
            throw new ApiFieldException(
                    HttpStatus.BAD_REQUEST,
                    "Error de validación",
                    Map.of("phone", List.of("El teléfono ya está registrado.")));
        }

        UserEntity user = new UserEntity();
        user.setFirstName(request.firstName().trim());
        user.setLastName(request.lastName().trim());
        user.setEmail(email);
        user.setPhone(phone);
        user.setPasswordHash(passwordHashService.hash(request.password()));
        user.setActive(true);
        user.setVerified(false);

        UserEntity savedUser = userRepository.saveAndFlush(user);
        UserEntity userWithRoles = userRepository.findByEmailIgnoreCase(email).orElse(savedUser);
        userWithRoles = assignRequestedRole(userWithRoles, request.userType());
        return authResponse(userWithRoles);
    }

    /**
     * El trigger trg_assign_default_role ya deja a todo usuario nuevo como CIUDADANO.
     * Si el tipo elegido mapea a un rol distinto, se lo añadimos como rol adicional.
     */
    private UserEntity assignRequestedRole(UserEntity user, String userType) {
        if (userType == null || userType.isBlank()) {
            return user;
        }

        String roleName = USER_TYPE_TO_ROLE.get(userType.trim().toUpperCase(Locale.ROOT));
        if (roleName == null || roleName.equals(DEFAULT_ROLE)) {
            return user;
        }

        return roleRepository.findByName(roleName)
                .map(role -> {
                    userRoleRepository.save(new UserRoleEntity(user, role));
                    return userRepository.findByEmailIgnoreCase(user.getEmail()).orElse(user);
                })
                .orElse(user);
    }

    public MessageResponse logout() {
        return new MessageResponse("Sesión cerrada. Descarta los tokens de acceso y refresco en el cliente.");
    }

    private AuthResponse authResponse(UserEntity user) {
        var roles = profileMapper.roles(user);
        return new AuthResponse(
                jwtService.createAccessToken(user, roles),
                jwtService.createRefreshToken(user, roles),
                profileMapper.toResponse(user));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }

    private ResponseStatusException invalidCredentials() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Correo o contraseña inválidos.");
    }
}
