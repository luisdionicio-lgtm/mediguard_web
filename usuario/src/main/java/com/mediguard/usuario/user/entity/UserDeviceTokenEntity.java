package com.mediguard.usuario.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(
        name = "user_device_tokens",
        uniqueConstraints = @UniqueConstraint(columnNames = {"provider", "token"}))
public class UserDeviceTokenEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private UserEntity user;

    @Column(nullable = false, length = 20)
    private String provider;

    @Column(nullable = false, length = 512)
    private String token;

    @Column(nullable = false, length = 20)
    private String platform;

    @Column(name = "device_name", length = 120)
    private String deviceName;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private OffsetDateTime updatedAt;

    @Column(name = "last_seen_at", nullable = false)
    private OffsetDateTime lastSeenAt;

    public UUID getId() { return id; }
    public UserEntity getUser() { return user; }
    public String getProvider() { return provider; }
    public String getToken() { return token; }
    public String getPlatform() { return platform; }
    public String getDeviceName() { return deviceName; }
    public boolean isActive() { return active; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }
    public OffsetDateTime getLastSeenAt() { return lastSeenAt; }

    public void setUser(UserEntity user) { this.user = user; }
    public void setProvider(String provider) { this.provider = provider; }
    public void setToken(String token) { this.token = token; }
    public void setPlatform(String platform) { this.platform = platform; }
    public void setDeviceName(String deviceName) { this.deviceName = deviceName; }
    public void setActive(boolean active) { this.active = active; }
    public void setLastSeenAt(OffsetDateTime lastSeenAt) { this.lastSeenAt = lastSeenAt; }

    @PrePersist
    void prePersist() {
        OffsetDateTime now = OffsetDateTime.now();
        createdAt = createdAt == null ? now : createdAt;
        updatedAt = now;
        lastSeenAt = lastSeenAt == null ? now : lastSeenAt;
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = OffsetDateTime.now();
    }
}
