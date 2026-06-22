package com.mediguard.usuario.user.notification;

import com.mediguard.usuario.user.entity.EmergencyContactEntity;
import com.mediguard.usuario.user.entity.SosEventEntity;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class NoOpNotificationService implements NotificationService {

    public static final String STATUS_SIMULATED_ONLY = "SIMULATED_ONLY";

    @Override
    public NotificationResult notifySos(
            SosEventEntity event,
            List<EmergencyContactEntity> contacts) {
        return result(event, contacts);
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
}
