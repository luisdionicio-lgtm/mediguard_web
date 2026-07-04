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
import java.time.OffsetDateTime;
import java.util.UUID;

@Entity
@Table(name = "notification_log")
public class NotificationLogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(columnDefinition = "uuid", updatable = false, nullable = false)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sos_event_id", nullable = false)
    private SosEventEntity sosEvent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_user_id")
    private UserEntity recipientUser;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "emergency_contact_id")
    private EmergencyContactEntity emergencyContact;

    @Column(nullable = false, length = 20)
    private String channel;

    @Column(nullable = false, length = 20)
    private String provider;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String message = "";

    @Column(name = "provider_response", columnDefinition = "TEXT")
    private String providerResponse;

    @Column(name = "created_at", nullable = false)
    private OffsetDateTime createdAt;

    @Column(name = "sent_at")
    private OffsetDateTime sentAt;

    public UUID getId() { return id; }
    public SosEventEntity getSosEvent() { return sosEvent; }
    public UserEntity getRecipientUser() { return recipientUser; }
    public EmergencyContactEntity getEmergencyContact() { return emergencyContact; }
    public String getChannel() { return channel; }
    public String getProvider() { return provider; }
    public String getStatus() { return status; }
    public String getMessage() { return message; }
    public String getProviderResponse() { return providerResponse; }
    public OffsetDateTime getCreatedAt() { return createdAt; }
    public OffsetDateTime getSentAt() { return sentAt; }

    public void setSosEvent(SosEventEntity sosEvent) { this.sosEvent = sosEvent; }
    public void setRecipientUser(UserEntity recipientUser) { this.recipientUser = recipientUser; }
    public void setEmergencyContact(EmergencyContactEntity emergencyContact) { this.emergencyContact = emergencyContact; }
    public void setChannel(String channel) { this.channel = channel; }
    public void setProvider(String provider) { this.provider = provider; }
    public void setStatus(String status) { this.status = status; }
    public void setMessage(String message) { this.message = message; }
    public void setProviderResponse(String providerResponse) { this.providerResponse = providerResponse; }
    public void setSentAt(OffsetDateTime sentAt) { this.sentAt = sentAt; }

    @PrePersist
    void prePersist() {
        if (createdAt == null) {
            createdAt = OffsetDateTime.now();
        }
        if (message == null) {
            message = "";
        }
    }
}
