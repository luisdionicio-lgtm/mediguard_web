package com.mediguard.usuario.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.security.SecureRandom;
import java.time.Instant;
import java.util.HexFormat;
import java.util.UUID;

@Entity
@Table(name = "verification_tokens")
public class VerificationTokenEntity {

    public enum TokenType {
        EMAIL_VERIFICATION, PASSWORD_RESET, PHONE_VERIFICATION
    }

    private static final SecureRandom RANDOM = new SecureRandom();

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    // Generado en Java (no en el DEFAULT de PostgreSQL) para que el valor
    // exista de inmediato tras el save() y funcione igual en H2 (tests).
    @Column(unique = true, updatable = false, nullable = false)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(name = "token_type", nullable = false, columnDefinition = "token_type_enum")
    private TokenType tokenType;

    @Column(name = "expires_at", nullable = false)
    private Instant expiresAt;

    @Column(nullable = false)
    private boolean used = false;

    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;

    protected VerificationTokenEntity() {
    }

    public VerificationTokenEntity(UserEntity user, TokenType tokenType, Instant expiresAt) {
        this.user = user;
        this.tokenType = tokenType;
        this.expiresAt = expiresAt;
    }

    @PrePersist
    void prePersist() {
        if (token == null) {
            byte[] bytes = new byte[32];
            RANDOM.nextBytes(bytes);
            token = HexFormat.of().formatHex(bytes);
        }
        if (createdAt == null) {
            createdAt = Instant.now();
        }
    }

    public UUID getId() { return id; }
    public UserEntity getUser() { return user; }
    public String getToken() { return token; }
    public TokenType getTokenType() { return tokenType; }
    public Instant getExpiresAt() { return expiresAt; }
    public boolean isUsed() { return used; }
    public Instant getCreatedAt() { return createdAt; }
    public void markUsed() { this.used = true; }
}
