package com.mediguard.usuario.user.service;

import com.mediguard.usuario.user.dto.DeviceTokenRequest;
import com.mediguard.usuario.user.dto.DeviceTokenResponse;
import com.mediguard.usuario.user.entity.UserDeviceTokenEntity;
import com.mediguard.usuario.user.entity.UserEntity;
import com.mediguard.usuario.user.exception.ApiFieldException;
import com.mediguard.usuario.user.repository.UserDeviceTokenRepository;
import com.mediguard.usuario.user.repository.UserRepository;
import java.time.OffsetDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@Transactional
public class DeviceTokenService {

    private final UserDeviceTokenRepository deviceTokenRepository;
    private final UserRepository userRepository;

    public DeviceTokenService(
            UserDeviceTokenRepository deviceTokenRepository,
            UserRepository userRepository) {
        this.deviceTokenRepository = deviceTokenRepository;
        this.userRepository = userRepository;
    }

    public RegistrationResult register(DeviceTokenRequest request) {
        UserEntity user = currentUser();
        String provider = request.provider().trim().toUpperCase();
        String platform = request.platform().trim().toUpperCase();
        String token = request.token().trim();

        var existing = deviceTokenRepository.findByProviderAndToken(provider, token);
        if (existing.isPresent() && !existing.get().getUser().getId().equals(user.getId())) {
            throw new ApiFieldException(
                    HttpStatus.CONFLICT,
                    "Token no disponible",
                    Map.of("token", List.of("El token ya pertenece a otro usuario.")));
        }

        boolean created = existing.isEmpty();
        UserDeviceTokenEntity deviceToken = existing.orElseGet(UserDeviceTokenEntity::new);
        deviceToken.setUser(user);
        deviceToken.setProvider(provider);
        deviceToken.setToken(token);
        deviceToken.setPlatform(platform);
        deviceToken.setDeviceName(blankToNull(request.deviceName()));
        deviceToken.setActive(true);
        deviceToken.setLastSeenAt(OffsetDateTime.now());

        return new RegistrationResult(
                toResponse(deviceTokenRepository.save(deviceToken)),
                created);
    }

    @Transactional(readOnly = true)
    public List<DeviceTokenResponse> listCurrentUserTokens() {
        UserEntity user = currentUser();
        return deviceTokenRepository.findAllByUser_IdOrderByUpdatedAtDesc(user.getId())
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public void deactivate(UUID id) {
        UserEntity user = currentUser();
        UserDeviceTokenEntity deviceToken = deviceTokenRepository.findByIdAndUser_Id(id, user.getId())
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Token de dispositivo no encontrado."));
        deviceToken.setActive(false);
        deviceTokenRepository.save(deviceToken);
    }

    private DeviceTokenResponse toResponse(UserDeviceTokenEntity token) {
        return new DeviceTokenResponse(
                token.getId(),
                token.getProvider(),
                token.getPlatform(),
                token.getDeviceName(),
                token.isActive(),
                preview(token.getToken()),
                token.getCreatedAt(),
                token.getUpdatedAt(),
                token.getLastSeenAt());
    }

    private UserEntity currentUser() {
        var authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Autenticación requerida.");
        }
        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .filter(user -> Boolean.TRUE.equals(user.getActive()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Usuario no encontrado."));
    }

    private String preview(String token) {
        if (token.length() <= 10) {
            return "****";
        }
        return token.substring(0, 6) + "..." + token.substring(token.length() - 4);
    }

    private String blankToNull(String value) {
        return value == null || value.isBlank() ? null : value.trim();
    }

    public record RegistrationResult(DeviceTokenResponse response, boolean created) {
    }
}
