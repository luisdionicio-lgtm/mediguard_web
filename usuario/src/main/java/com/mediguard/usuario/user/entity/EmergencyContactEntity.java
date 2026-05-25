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
import java.time.OffsetDateTime;

@Entity
@Table(name = "emergency_contactoemergencia")
public class EmergencyContactEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private UserEntity user;

    @Column(name = "nombre", nullable = false, length = 100)
    private String name;

    @Column(name = "telefono", nullable = false, length = 20)
    private String phone;

    @Column(name = "relacion", nullable = false, length = 20)
    private String relationship = "otro";

    @Column(name = "es_principal", nullable = false)
    private Boolean primaryContact = false;

    @Column(length = 254)
    private String email;

    @Column(name = "notas", nullable = false, length = 255)
    private String notes = "";

    @Column(name = "creado_en", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "actualizado_en", nullable = false)
    private OffsetDateTime updatedAt;

    public EmergencyContactEntity() {
    }

    public Long getId() { return id; }
    public UserEntity getUser() { return user; }
    public String getName() { return name; }
    public String getPhone() { return phone; }
    public String getRelationship() { return relationship; }
    public Boolean getPrimaryContact() { return primaryContact; }
    public String getEmail() { return email; }
    public String getNotes() { return notes; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getUpdatedAt() { return updatedAt; }

    public void setUser(UserEntity user) { this.user = user; }
    public void setName(String name) { this.name = name; }
    public void setPhone(String phone) { this.phone = phone; }
    public void setRelationship(String relationship) { this.relationship = relationship; }
    public void setPrimaryContact(Boolean primaryContact) { this.primaryContact = primaryContact; }
    public void setEmail(String email) { this.email = email; }
    public void setNotes(String notes) { this.notes = notes; }

    @PrePersist
    void prePersist() {
        OffsetDateTime now = OffsetDateTime.now();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
        applyDefaults();
    }

    @PreUpdate
    void preUpdate() {
        updatedAt = OffsetDateTime.now();
        applyDefaults();
    }

    private void applyDefaults() {
        if (relationship == null || relationship.isBlank()) {
            relationship = "otro";
        }
        if (primaryContact == null) {
            primaryContact = false;
        }
        if (notes == null) {
            notes = "";
        }
    }
}
