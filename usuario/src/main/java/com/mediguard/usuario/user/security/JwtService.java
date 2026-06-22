package com.mediguard.usuario.user.security;

import com.mediguard.usuario.user.entity.UserEntity;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Base64;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class JwtService {

    private static final String HMAC_SHA256 = "HmacSHA256";
    private static final Base64.Encoder URL_ENCODER = Base64.getUrlEncoder().withoutPadding();
    private static final Base64.Decoder URL_DECODER = Base64.getUrlDecoder();

    private final byte[] secret;
    private final long accessTokenSeconds;
    private final long refreshTokenSeconds;

    public JwtService(
            @Value("${app.security.jwt.secret}") String secret,
            @Value("${app.security.jwt.access-token-seconds:3600}") long accessTokenSeconds,
            @Value("${app.security.jwt.refresh-token-seconds:604800}") long refreshTokenSeconds) {
        if (secret == null || secret.length() < 32) {
            throw new IllegalStateException("app.security.jwt.secret must be at least 32 characters long");
        }
        this.secret = secret.getBytes(StandardCharsets.UTF_8);
        this.accessTokenSeconds = accessTokenSeconds;
        this.refreshTokenSeconds = refreshTokenSeconds;
    }

    public String createAccessToken(UserEntity user, List<String> roles) {
        return createToken(user, roles, "access", accessTokenSeconds);
    }

    public String createRefreshToken(UserEntity user, List<String> roles) {
        return createToken(user, roles, "refresh", refreshTokenSeconds);
    }

    public JwtClaims validateAccessToken(String token) {
        JwtClaims claims = validateToken(token);
        String tokenType = claims.tokenType();
        // Django SimpleJWT usa "access"; Spring Boot nativo usa "access" también
        if (tokenType != null && !"access".equals(tokenType)) {
            throw unauthorized("Tipo de token inválido.");
        }
        return claims;
    }

    public JwtClaims validateRefreshToken(String token) {
        JwtClaims claims = validateToken(token);
        if (!"refresh".equals(claims.tokenType())) {
            throw unauthorized("Tipo de token inválido.");
        }
        return claims;
    }

    private String createToken(UserEntity user, List<String> roles, String tokenType, long lifetimeSeconds) {
        Instant now = Instant.now();
        String header = "{\"alg\":\"HS256\",\"typ\":\"JWT\"}";
        String payload = "{"
                + "\"sub\":\"" + escapeJson(user.getEmail()) + "\","
                + "\"uid\":\"" + user.getId() + "\","
                + "\"roles\":" + rolesJson(roles) + ","
                + "\"token_type\":\"" + tokenType + "\","
                + "\"iat\":" + now.getEpochSecond() + ","
                + "\"exp\":" + now.plusSeconds(lifetimeSeconds).getEpochSecond()
                + "}";

        String unsignedToken = encode(header) + "." + encode(payload);
        return unsignedToken + "." + sign(unsignedToken);
    }

    private JwtClaims validateToken(String token) {
        String[] parts = token == null ? new String[0] : token.split("\\.");
        if (parts.length != 3) {
            throw unauthorized("Token malformado.");
        }

        String unsignedToken = parts[0] + "." + parts[1];
        if (!constantTimeEquals(sign(unsignedToken), parts[2])) {
            throw unauthorized("Firma del token inválida.");
        }

        String payload = decode(parts[1]);
        long expiresAt = readLong(payload, "exp");
        if (Instant.now().getEpochSecond() >= expiresAt) {
            throw unauthorized("Token expirado.");
        }

        return new JwtClaims(
                readString(payload, "sub"),
                readUserIdClaim(payload),
                readTokenTypeClaim(payload),
                readStringListOptional(payload, "roles"));
    }

    private String encode(String value) {
        return URL_ENCODER.encodeToString(value.getBytes(StandardCharsets.UTF_8));
    }

    private String decode(String value) {
        try {
            return new String(URL_DECODER.decode(value), StandardCharsets.UTF_8);
        } catch (Exception ex) {
            throw unauthorized("Contenido del token inválido.");
        }
    }

    private String sign(String unsignedToken) {
        try {
            Mac mac = Mac.getInstance(HMAC_SHA256);
            mac.init(new SecretKeySpec(secret, HMAC_SHA256));
            return URL_ENCODER.encodeToString(mac.doFinal(unsignedToken.getBytes(StandardCharsets.UTF_8)));
        } catch (Exception ex) {
            throw new IllegalStateException("Unable to sign JWT", ex);
        }
    }

    private boolean constantTimeEquals(String expected, String actual) {
        byte[] expectedBytes = expected.getBytes(StandardCharsets.UTF_8);
        byte[] actualBytes = actual.getBytes(StandardCharsets.UTF_8);
        if (expectedBytes.length != actualBytes.length) {
            return false;
        }
        int result = 0;
        for (int i = 0; i < expectedBytes.length; i++) {
            result |= expectedBytes[i] ^ actualBytes[i];
        }
        return result == 0;
    }

    private String rolesJson(List<String> roles) {
        return roles.stream()
                .map(role -> "\"" + escapeJson(role) + "\"")
                .reduce((left, right) -> left + "," + right)
                .map(value -> "[" + value + "]")
                .orElse("[]");
    }

    private String escapeJson(String value) {
        return value.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    private String readString(String payload, String key) {
        Matcher matcher = Pattern.compile("\"" + Pattern.quote(key) + "\"\\s*:\\s*\"([^\"]*)\"").matcher(payload);
        if (!matcher.find()) {
            throw unauthorized("Falta información requerida en el token.");
        }
        return matcher.group(1);
    }

    private List<String> readStringList(String payload, String key) {
        Matcher matcher = Pattern.compile("\"" + Pattern.quote(key) + "\"\\s*:\\s*\\[(.*?)]").matcher(payload);
        if (!matcher.find() || matcher.group(1).isBlank()) {
            return List.of();
        }
        return Pattern.compile("\"([^\"]*)\"").matcher(matcher.group(1)).results()
                .map(match -> match.group(1))
                .toList();
    }

    private List<String> readStringListOptional(String payload, String key) {
        try {
            return readStringList(payload, key);
        } catch (Exception e) {
            return List.of();
        }
    }

    // Accepts "uid" (Spring Boot native) or "user_id" (Django SimpleJWT compat)
    private String readUserIdClaim(String payload) {
        Matcher uidMatcher = Pattern.compile("\"uid\"\\s*:\\s*\"([^\"]*)\"").matcher(payload);
        if (uidMatcher.find()) {
            return uidMatcher.group(1);
        }
        Matcher userIdMatcher = Pattern.compile("\"user_id\"\\s*:\\s*\"([^\"]*)\"").matcher(payload);
        if (userIdMatcher.find()) {
            return userIdMatcher.group(1);
        }
        throw unauthorized("Falta información requerida en el token (uid/user_id).");
    }

    // Accepts "token_type" values from both Spring Boot ("access") and Django ("access")
    private String readTokenTypeClaim(String payload) {
        Matcher matcher = Pattern.compile("\"token_type\"\\s*:\\s*\"([^\"]*)\"").matcher(payload);
        if (matcher.find()) {
            return matcher.group(1);
        }
        return "access";
    }

    private long readLong(String payload, String key) {
        Matcher matcher = Pattern.compile("\"" + Pattern.quote(key) + "\"\\s*:\\s*(\\d+)").matcher(payload);
        if (matcher.find()) {
            return Long.parseLong(matcher.group(1));
        }
        throw unauthorized("Falta la expiración del token.");
    }

    private ResponseStatusException unauthorized(String reason) {
        return new ResponseStatusException(HttpStatus.UNAUTHORIZED, reason);
    }

    public record JwtClaims(String email, String userId, String tokenType, List<String> roles) {
    }
}
