package com.mediguard.usuario.user.security;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

import com.mediguard.usuario.user.entity.UserEntity;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.UUID;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;
import org.springframework.web.server.ResponseStatusException;

class JwtServiceTest {

    private static final String SECRET = "test-only-jwt-secret-with-at-least-32-characters";

    private JwtService jwtService;
    private UserEntity user;

    @BeforeEach
    void setUp() {
        jwtService = new JwtService(SECRET, 3600, 604800);
        user = new UserEntity();
        user.setEmail("jwt@example.com");
        ReflectionTestUtils.setField(user, "id", UUID.fromString("11111111-1111-1111-1111-111111111111"));
    }

    @Test
    void accessTokenRoundTripPreservesIdentityAndRoles() {
        var claims = jwtService.validateAccessToken(
                jwtService.createAccessToken(user, List.of("CIUDADANO", "ADMIN")));

        assertEquals("jwt@example.com", claims.email());
        assertEquals("11111111-1111-1111-1111-111111111111", claims.userId());
        assertEquals("access", claims.tokenType());
        assertEquals(List.of("CIUDADANO", "ADMIN"), claims.roles());
    }

    @Test
    void refreshTokenCannotBeUsedAsAccessToken() {
        String refresh = jwtService.createRefreshToken(user, List.of("CIUDADANO"));

        assertThrows(ResponseStatusException.class, () -> jwtService.validateAccessToken(refresh));
    }

    @Test
    void accessTokenCannotBeUsedAsRefreshToken() {
        String access = jwtService.createAccessToken(user, List.of("CIUDADANO"));

        assertThrows(ResponseStatusException.class, () -> jwtService.validateRefreshToken(access));
    }

    @Test
    void tamperedTokenIsRejected() {
        String access = jwtService.createAccessToken(user, List.of("CIUDADANO"));
        String tampered = access.substring(0, access.length() - 1) + (access.endsWith("a") ? "b" : "a");

        assertThrows(ResponseStatusException.class, () -> jwtService.validateAccessToken(tampered));
    }

    @Test
    void djangoAccessTokenShapeIsAccepted() throws Exception {
        long now = Instant.now().getEpochSecond();
        String payload = """
                {"sub":"django@example.com","user_id":"22222222-2222-2222-2222-222222222222",\
                "roles":["CIUDADANO"],"token_type":"access","iat":%d,"exp":%d}
                """.formatted(now, now + 3600).replace("\n", "");

        var claims = jwtService.validateAccessToken(sign(payload));

        assertEquals("django@example.com", claims.email());
        assertEquals("22222222-2222-2222-2222-222222222222", claims.userId());
        assertEquals(List.of("CIUDADANO"), claims.roles());
    }

    @Test
    void shortSecretIsRejected() {
        assertThrows(IllegalStateException.class, () -> new JwtService("short", 3600, 604800));
    }

    private String sign(String payload) throws Exception {
        Base64.Encoder encoder = Base64.getUrlEncoder().withoutPadding();
        String header = encoder.encodeToString("{\"alg\":\"HS256\",\"typ\":\"JWT\"}"
                .getBytes(StandardCharsets.UTF_8));
        String encodedPayload = encoder.encodeToString(payload.getBytes(StandardCharsets.UTF_8));
        String unsigned = header + "." + encodedPayload;
        Mac mac = Mac.getInstance("HmacSHA256");
        mac.init(new SecretKeySpec(SECRET.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
        return unsigned + "." + encoder.encodeToString(mac.doFinal(unsigned.getBytes(StandardCharsets.UTF_8)));
    }
}
