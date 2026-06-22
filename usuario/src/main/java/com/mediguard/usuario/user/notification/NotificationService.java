package com.mediguard.usuario.user.notification;

import com.mediguard.usuario.user.entity.EmergencyContactEntity;
import com.mediguard.usuario.user.entity.SosEventEntity;
import java.util.List;

public interface NotificationService {

    NotificationResult notifySos(
            SosEventEntity event,
            List<EmergencyContactEntity> contacts);

    NotificationResult summarize(
            SosEventEntity event,
            List<EmergencyContactEntity> contacts);
}
