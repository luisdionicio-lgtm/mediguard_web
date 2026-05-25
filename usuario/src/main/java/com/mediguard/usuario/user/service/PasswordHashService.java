package com.mediguard.usuario.user.service;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class PasswordHashService {

    private static final String DJANGO_PBKDF2_SHA256 = "pbkdf2_sha256";
    private final PasswordEncoder passwordEncoder;

    public PasswordHashService(PasswordEncoder passwordEncoder) {
        this.passwordEncoder = passwordEncoder;
    }

    public String hash(String rawPassword) {
        return passwordEncoder.encode(rawPassword);
    }

    public boolean matches(String rawPassword, String storedHash) {
        if (storedHash == null || storedHash.isBlank()) {
            return false;
        }
        if (storedHash.startsWith(DJANGO_PBKDF2_SHA256 + "$")) {
            return matchesDjangoPbkdf2Sha256(rawPassword, storedHash);
        }
        return passwordEncoder.matches(rawPassword, storedHash);
    }

    private boolean matchesDjangoPbkdf2Sha256(String rawPassword, String storedHash) {
        String[] parts = storedHash.split("\\$", 4);
        if (parts.length != 4) {
            return false;
        }

        try {
            int iterations = Integer.parseInt(parts[1]);
            String salt = parts[2];
            byte[] expected = Base64.getDecoder().decode(parts[3]);
            byte[] actual = pbkdf2Sha256(rawPassword.toCharArray(), salt.getBytes(StandardCharsets.UTF_8), iterations);
            return MessageDigest.isEqual(expected, actual);
        } catch (Exception ex) {
            return false;
        }
    }

    private byte[] pbkdf2Sha256(char[] password, byte[] salt, int iterations) throws Exception {
        PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, 256);
        SecretKeyFactory factory = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256");
        return factory.generateSecret(spec).getEncoded();
    }
}
