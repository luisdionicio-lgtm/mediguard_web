package com.mediguard.usuario.user.notification;

public record NotificationResult(
        int contactsFound,
        int notifiableContacts,
        int notifiedContacts,
        int simulatedContacts,
        boolean realNotificationEnabled,
        String status,
        String message
) {
}
