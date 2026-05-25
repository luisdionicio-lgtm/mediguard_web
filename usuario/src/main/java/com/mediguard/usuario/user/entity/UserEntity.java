package com.mediguard.usuario.user.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.PrePersist;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "users")
public class UserEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(nullable = false, unique = true, length = 255)
    private String email;

    @Column(unique = true, length = 20)
    private String phone;

    @Column(name = "password_hash", nullable = false, length = 255)
    @JsonIgnore
    private String passwordHash;

    @Column(name = "avatar_url", length = 500)
    private String avatarUrl;

    @Column(columnDefinition = "TEXT")
    private String bio;

    @Column(name = "is_active", nullable = false)
    private Boolean active = true;

    @Column(name = "is_verified", nullable = false)
    private Boolean verified = false;

    @Column(name = "last_login_at")
    private Instant lastLoginAt;

    @Column(name = "created_at", updatable = false, nullable = false)
    private Instant createdAt;

    // Manejado por trigger trg_users_updated_at — Spring Boot nunca lo escribe
    @Column(name = "updated_at", insertable = false, updatable = false)
    private Instant updatedAt;

    @OneToMany(mappedBy = "user", fetch = FetchType.LAZY)
    private List<UserRoleEntity> userRoles;

    public UserEntity() {
    }

    public UUID getId() { return id; }
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getPasswordHash() { return passwordHash; }
    public String getAvatarUrl() { return avatarUrl; }
    public String getBio() { return bio; }
    public Boolean getActive() { return active; }
    public Boolean getVerified() { return verified; }
    public Instant getLastLoginAt() { return lastLoginAt; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public List<UserRoleEntity> getUserRoles() { return userRoles; }

    public void setFirstName(String firstName) { this.firstName = firstName; }
    public void setLastName(String lastName) { this.lastName = lastName; }
    public void setEmail(String email) { this.email = email; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public void setBio(String bio) { this.bio = bio; }
    public void setActive(Boolean active) { this.active = active; }
    public void setVerified(Boolean verified) { this.verified = verified; }
    public void setLastLoginAt(Instant lastLoginAt) { this.lastLoginAt = lastLoginAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = Instant.now();
        }
        if (active == null) {
            active = true;
        }
        if (verified == null) {
            verified = false;
        }
    }
}
