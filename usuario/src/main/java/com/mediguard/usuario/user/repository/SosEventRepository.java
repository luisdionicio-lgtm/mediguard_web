package com.mediguard.usuario.user.repository;

import com.mediguard.usuario.user.entity.SosEventEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SosEventRepository extends JpaRepository<SosEventEntity, Long> {

    List<SosEventEntity> findByUser_IdOrderByActivatedAtDesc(UUID userId);

    Optional<SosEventEntity> findByIdAndUser_Id(Long id, UUID userId);
}
