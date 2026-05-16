package com.mediguard.usuario.user.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.OffsetDateTime;

@Entity
@Table(name = "emergency_numeroservicioemergencia")
public class EmergencyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String name;

    @Column(name = "telefono", nullable = false, length = 20)
    private String phone;

    @Column(name = "tipo_servicio", nullable = false, length = 20)
    private String serviceType;

    @Column(name = "codigo_pais", nullable = false, length = 5)
    private String countryCode;

    @Column(name = "descripcion", nullable = false, length = 255)
    private String description;

    @Column(name = "activo", nullable = false)
    private Boolean active;

    @Column(name = "prioridad", nullable = false)
    private Integer priority;

    @Column(name = "creado_en")
    private OffsetDateTime createdAt;

    @Column(name = "actualizado_en")
    private OffsetDateTime updatedAt;

    protected EmergencyEntity() {
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getPhone() {
        return phone;
    }

    public String getServiceType() {
        return serviceType;
    }

    public String getCountryCode() {
        return countryCode;
    }

    public String getDescription() {
        return description;
    }

    public Boolean getActive() {
        return active;
    }

    public Integer getPriority() {
        return priority;
    }

    public OffsetDateTime getCreatedAt() {
        return createdAt;
    }

    public OffsetDateTime getUpdatedAt() {
        return updatedAt;
    }
}
