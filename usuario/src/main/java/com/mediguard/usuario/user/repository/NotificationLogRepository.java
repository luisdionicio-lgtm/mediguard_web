package com.mediguard.usuario.user.repository;

import com.mediguard.usuario.user.entity.NotificationLogEntity;
import java.util.List;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationLogRepository extends JpaRepository<NotificationLogEntity, UUID> {

    List<NotificationLogEntity> findAllBySosEvent_IdOrderByCreatedAtAsc(Long sosEventId);
}
