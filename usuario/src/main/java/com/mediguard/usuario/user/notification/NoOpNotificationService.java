package com.mediguard.usuario.user.notification;

import com.mediguard.usuario.user.entity.EmergencyContactEntity;
import com.mediguard.usuario.user.entity.NotificationLogEntity;
import com.mediguard.usuario.user.entity.SosEventEntity;
import com.mediguard.usuario.user.repository.NotificationLogRepository;
import java.util.List;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(
        name = "app.notifications.provider",
        havingValue = "noop",
        matchIfMissing = true)
public class NoOpNotificationService implements NotificationService {

    public static final String STATUS_SIMULATED_ONLY = "SIMULATED_ONLY";
    private static final String AUDIT_STATUS_SIMULATED = "SIMULATED";

    private final NotificationLogRepository notificationLogRepository;

    public NoOpNotificationService(NotificationLogRepository notificationLogRepository) {
        this.notificationLogRepository = notificationLogRepository;
    }

    @Override
    public NotificationResult notifySos(
            SosEventEntity event,
            List<EmergencyContactEntity> contacts) {
        NotificationResult result = result(event, contacts);
        List<EmergencyContactEntity> targets = contacts.stream()
                .filter(contact -> contact.getPhone() != null && !contact.getPhone().isBlank())
                .toList();

        if (targets.isEmpty()) {
            notificationLogRepository.save(logFor(event, null));
        } else {
            notificationLogRepository.saveAll(targets.stream()
                    .map(contact -> logFor(event, contact))
                    .toList());
        }
        return result;
    }

    @Override
    public NotificationResult summarize(
            SosEventEntity event,
            List<EmergencyContactEntity> contacts) {
        return result(event, contacts);
    }

    private NotificationResult result(
            SosEventEntity event,
            List<EmergencyContactEntity> contacts) {
        int contactsFound = contacts.size();
        int notifiableContacts = (int) contacts.stream()
                .filter(contact -> contact.getPhone() != null && !contact.getPhone().isBlank())
                .count();
        int notifiedContacts = event.getNotifiedContacts() == null
                ? 0
                : event.getNotifiedContacts();

        return new NotificationResult(
                contactsFound,
                notifiableContacts,
                notifiedContacts,
                notifiableContacts,
                false,
                STATUS_SIMULATED_ONLY,
                "Notificación real pendiente de integración; no se enviaron avisos.");
    }

    private NotificationLogEntity logFor(
            SosEventEntity event,
            EmergencyContactEntity contact) {
        NotificationLogEntity log = new NotificationLogEntity();
        log.setSosEvent(event);
        log.setEmergencyContact(contact);
        log.setChannel("NOOP");
        log.setProvider("NOOP");
        log.setStatus(AUDIT_STATUS_SIMULATED);
        log.setMessage("Intento simulado; no se envió una notificación real.");
        log.setProviderResponse("NoOpNotificationService: sin llamada externa.");
        return log;
    }
}
