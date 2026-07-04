package com.mediguard.usuario.user.service;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.mediguard.usuario.user.dto.AuthResponse;
import com.mediguard.usuario.user.dto.GoogleAuthRequest;
import com.mediguard.usuario.user.dto.LoginRequest;
import com.mediguard.usuario.user.dto.MessageResponse;
import com.mediguard.usuario.user.dto.RefreshTokenRequest;
import com.mediguard.usuario.user.dto.RegisterRequest;
import com.mediguard.usuario.user.entity.UserEntity;
import com.mediguard.usuario.user.entity.UserRoleEntity;
import com.mediguard.usuario.user.entity.UserRoleId;
import com.mediguard.usuario.user.exception.ApiFieldException;
import com.mediguard.usuario.user.repository.RoleRepository;
import com.mediguard.usuario.user.repository.UserRepository;
import com.mediguard.usuario.user.repository.UserRoleRepository;
import com.mediguard.usuario.user.security.JwtService;
import jakarta.persistence.EntityManager;
import java.time.Instant;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;
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
    private static final String GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final UserRoleRepository userRoleRepository;
    private final PasswordHashService passwordHashService;
    private final JwtService jwtService;
    private final ProfileMapper profileMapper;
    private final EntityManager entityManager;
    private final RestClient restClient;

    public AuthService(
            UserRepository userRepository,
            RoleRepository roleRepository,
            UserRoleRepository userRoleRepository,
            PasswordHashService passwordHashService,
            JwtService jwtService,
            ProfileMapper profileMapper,
            EntityManager entityManager) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.userRoleRepository = userRoleRepository;
        this.passwordHashService = passwordHashService;
        this.jwtService = jwtService;
        this.profileMapper = profileMapper;
        this.entityManager = entityManager;
        this.restClient = RestClient.create();
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
        UserEntity userWithRoles = ensureDefaultRole(savedUser);
        userWithRoles = assignRequestedRole(userWithRoles, request.userType());
        return authResponse(userWithRoles);
    }

    public AuthResponse refresh(RefreshTokenRequest request) {
        var claims = jwtService.validateRefreshToken(request.refresh());
        UserEntity user = userRepository.findByEmailIgnoreCase(claims.email())
                .filter(candidate -> Boolean.TRUE.equals(candidate.getActive()))
                .filter(candidate -> candidate.getId().toString().equals(claims.userId()))
                .orElseThrow(this::invalidRefreshToken);
        return authResponse(user);
    }

    /**
     * Reemplaza al antiguo flujo de Google en Django (VistaGoogleAuth): el frontend ya
     * obtuvo un access_token de Google (flujo implícito), aquí solo lo validamos contra
     * el userinfo endpoint y mapeamos el usuario al esquema compartido.
     */
    public AuthResponse googleLogin(GoogleAuthRequest request) {
        GoogleUserInfo googleUser = fetchGoogleUserInfo(request.accessToken());
        String email = normalizeEmail(googleUser.email());

        UserEntity user = userRepository.findByEmailIgnoreCase(email).orElse(null);
        if (user == null) {
            UserEntity newUser = new UserEntity();
            newUser.setFirstName(blankToEmpty(googleUser.givenName()));
            newUser.setLastName(blankToEmpty(googleUser.familyName()));
            newUser.setEmail(email);
            // No hay equivalente a set_unusable_password(): generamos un hash aleatorio
            // que nadie puede conocer ni adivinar, así la cuenta solo se accede por Google.
            newUser.setPasswordHash(passwordHashService.hash(UUID.randomUUID().toString()));
            newUser.setAvatarUrl(googleUser.picture());
            newUser.setActive(true);
            newUser.setVerified(true);

            UserEntity savedUser = userRepository.saveAndFlush(newUser);
            user = ensureDefaultRole(savedUser);
        } else {
            if (!Boolean.TRUE.equals(user.getActive())) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cuenta desactivada. Contacta al administrador.");
            }
            if (googleUser.picture() != null && !googleUser.picture().isBlank()
                    && (user.getAvatarUrl() == null || user.getAvatarUrl().isBlank())) {
                user.setAvatarUrl(googleUser.picture());
                user = userRepository.save(user);
            }
        }

        return authResponse(user);
    }

    private GoogleUserInfo fetchGoogleUserInfo(String accessToken) {
        GoogleUserInfo userInfo;
        try {
            userInfo = restClient.get()
                    .uri(GOOGLE_USERINFO_URL)
                    .header("Authorization", "Bearer " + accessToken)
                    .retrieve()
                    .body(GoogleUserInfo.class);
        } catch (RestClientException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Token de Google inválido o expirado.");
        }

        if (userInfo == null || userInfo.email() == null || userInfo.email().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El token de Google no contiene email.");
        }
        return userInfo;
    }

    private String blankToEmpty(String value) {
        return value == null ? "" : value;
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    private record GoogleUserInfo(String email, String given_name, String family_name, String picture) {
        String givenName() {
            return given_name;
        }

        String familyName() {
            return family_name;
        }
    }

    private UserEntity ensureDefaultRole(UserEntity user) {
        var defaultRole = roleRepository.findByName(DEFAULT_ROLE)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.INTERNAL_SERVER_ERROR,
                        "El rol CIUDADANO no está configurado."));
        var roleId = new UserRoleId(user.getId(), defaultRole.getId());
        if (!userRoleRepository.existsById(roleId)) {
            userRoleRepository.saveAndFlush(new UserRoleEntity(user, defaultRole));
        }
        return reloadUser(user);
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
                    userRoleRepository.flush();
                    return reloadUser(user);
                })
                .orElse(user);
    }

    private UserEntity reloadUser(UserEntity user) {
        entityManager.clear();
        return userRepository.findByEmailIgnoreCase(user.getEmail()).orElse(user);
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

    private ResponseStatusException invalidRefreshToken() {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Refresh token inválido.");
    }
}
