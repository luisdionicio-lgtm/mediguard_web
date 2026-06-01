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
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.OffsetDateTime;
import java.time.temporal.ChronoUnit;

@Entity
@Table(name = "emergency_eventosos")
public class SosEventEntity {

    public static final String STATUS_ACTIVE = "activado";
    public static final String STATUS_RESOLVED = "resuelto";
    public static final String STATUS_FALSE_ALARM = "falsa_alarma";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", nullable = false)
    private UserEntity user;

    @Column(name = "estado", nullable = false, length = 20)
    private String status = STATUS_ACTIVE;

    @Column(name = "ubicacion_latitud", precision = 9, scale = 6)
    private BigDecimal latitude;

    @Column(name = "ubicacion_longitud", precision = 9, scale = 6)
    private BigDecimal longitude;

    @Column(name = "notas", nullable = false, columnDefinition = "TEXT")
    private String notes = "";

    @Column(name = "dispositivo", nullable = false, length = 100)
    private String device = "";

    @Column(name = "direccion_aproximada", nullable = false, length = 255)
    private String approximateAddress = "";

    @Column(name = "duracion_segundos")
    private Integer durationSeconds;

    @Column(name = "contactos_notificados", nullable = false)
    private Integer notifiedContacts = 0;

    @Column(name = "activado_en", nullable = false)
    private OffsetDateTime activatedAt;

    @Column(name = "resuelto_en")
    private OffsetDateTime resolvedAt;

    public SosEventEntity() {
    }

    public Long getId() { return id; }
    public UserEntity getUser() { return user; }
    public String getStatus() { return status; }
    public BigDecimal getLatitude() { return latitude; }
    public BigDecimal getLongitude() { return longitude; }
    public String getNotes() { return notes; }
    public String getDevice() { return device; }
    public String getApproximateAddress() { return approximateAddress; }
    public Integer getDurationSeconds() { return durationSeconds; }
    public Integer getNotifiedContacts() { return notifiedContacts; }
    public OffsetDateTime getActivatedAt() { return activatedAt; }
    public OffsetDateTime getResolvedAt() { return resolvedAt; }

    public void setUser(UserEntity user) { this.user = user; }
    public void setStatus(String status) { this.status = status; }
    public void setLatitude(BigDecimal latitude) { this.latitude = latitude; }
    public void setLongitude(BigDecimal longitude) { this.longitude = longitude; }
    public void setNotes(String notes) { this.notes = notes; }
    public void setDevice(String device) { this.device = device; }
    public void setApproximateAddress(String approximateAddress) { this.approximateAddress = approximateAddress; }
    public void setNotifiedContacts(Integer notifiedContacts) { this.notifiedContacts = notifiedContacts; }

    public void resolveIfTerminal() {
        if ((STATUS_RESOLVED.equals(status) || STATUS_FALSE_ALARM.equals(status)) && resolvedAt == null) {
            resolvedAt = OffsetDateTime.now();
            if (activatedAt != null) {
                durationSeconds = Math.toIntExact(ChronoUnit.SECONDS.between(activatedAt, resolvedAt));
            }
        }
    }

    @PrePersist
    void prePersist() {
        if (activatedAt == null) {
            activatedAt = OffsetDateTime.now();
        }
        applyDefaults();
        resolveIfTerminal();
    }

    private void applyDefaults() {
        if (status == null || status.isBlank()) {
            status = STATUS_ACTIVE;
        }
        if (notes == null) {
            notes = "";
        }
        if (device == null) {
            device = "";
        }
        if (approximateAddress == null) {
            approximateAddress = "";
        }
        if (notifiedContacts == null) {
            notifiedContacts = 0;
        }
    }
}
