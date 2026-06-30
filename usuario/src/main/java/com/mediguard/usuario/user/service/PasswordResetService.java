package com.mediguard.usuario.user.service;

import com.mediguard.usuario.user.dto.MessageResponse;
import com.mediguard.usuario.user.entity.UserEntity;
import com.mediguard.usuario.user.entity.VerificationTokenEntity;
import com.mediguard.usuario.user.entity.VerificationTokenEntity.TokenType;
import com.mediguard.usuario.user.exception.ApiFieldException;
import com.mediguard.usuario.user.repository.UserRepository;
import com.mediguard.usuario.user.repository.VerificationTokenRepository;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class PasswordResetService {

    private static final String GENERIC_RESPONSE_MESSAGE =
            "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña.";
    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private final UserRepository userRepository;
    private final VerificationTokenRepository verificationTokenRepository;
    private final PasswordHashService passwordHashService;
    private final PasswordResetMailService mailService;

    public PasswordResetService(
            UserRepository userRepository,
            VerificationTokenRepository verificationTokenRepository,
            PasswordHashService passwordHashService,
            PasswordResetMailService mailService) {
        this.userRepository = userRepository;
        this.verificationTokenRepository = verificationTokenRepository;
        this.passwordHashService = passwordHashService;
        this.mailService = mailService;
    }

    /**
     * Siempre responde el mismo mensaje, exista o no el correo, para no permitir
     * enumeración de cuentas registradas.
     */
    public MessageResponse requestReset(String email) {
        userRepository.findByEmailIgnoreCase(normalizeEmail(email))
                .filter(user -> Boolean.TRUE.equals(user.getActive()))
                .ifPresent(this::createTokenAndSendEmail);
        return new MessageResponse(GENERIC_RESPONSE_MESSAGE);
    }

    public MessageResponse resetPassword(String token, String newPassword) {
        VerificationTokenEntity verificationToken = verificationTokenRepository
                .findByTokenAndUsedFalse(token)
                .filter(candidate -> candidate.getTokenType() == TokenType.PASSWORD_RESET)
                .orElseThrow(this::invalidToken);

        if (verificationToken.getExpiresAt().isBefore(Instant.now())) {
            throw invalidToken();
        }

        UserEntity user = verificationToken.getUser();
        user.setPasswordHash(passwordHashService.hash(newPassword));
        userRepository.save(user);

        verificationToken.markUsed();
        verificationTokenRepository.save(verificationToken);

        return new MessageResponse("Contraseña actualizada correctamente.");
    }

    private void createTokenAndSendEmail(UserEntity user) {
        String generatedToken = generateToken();
        VerificationTokenEntity entity = new VerificationTokenEntity(
                user, generatedToken, TokenType.PASSWORD_RESET, Instant.now().plus(1, ChronoUnit.HOURS));
        verificationTokenRepository.save(entity);

        mailService.sendPasswordResetEmail(user.getEmail(), user.getFirstName(), generatedToken);
    }

    private String generateToken() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);
        return HexFormat.of().formatHex(bytes);
    }

    private ApiFieldException invalidToken() {
        return new ApiFieldException(
                HttpStatus.BAD_REQUEST,
                "Error de validación",
                Map.of("token", List.of("El token no es válido o ya expiró.")));
    }

    private String normalizeEmail(String email) {
        return email.trim().toLowerCase(Locale.ROOT);
    }
}
