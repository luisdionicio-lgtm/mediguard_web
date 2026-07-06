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
import org.hibernate.annotations.Type;
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

    // El DDL de Postgres define un DEFAULT encode(gen_random_bytes(32), 'hex'),
    // pero se envía explícitamente desde Java para que funcione igual en H2 (test).
    @Column(unique = true, updatable = false, nullable = false)
    private String token;

    // TokenTypeUserType bindea el parámetro con Types.OTHER en vez de
    // VARCHAR -- sin esto, Postgres rechaza el insert contra la columna
    // nativa token_type_enum (ver V1__identidad.sql) con "column
    // token_type is of type token_type_enum but expression is of type
    // character varying". Probado que SqlTypes.NAMED_ENUM no sirve aquí:
    // rompe los tests contra H2 (MODE=PostgreSQL) intentando convertir el
    // enum a bytes.
    @Enumerated(EnumType.STRING)
    @Type(TokenTypeUserType.class)
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

    public VerificationTokenEntity(UserEntity user, String token, TokenType tokenType, Instant expiresAt) {
        this.user = user;
        this.token = token;
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
