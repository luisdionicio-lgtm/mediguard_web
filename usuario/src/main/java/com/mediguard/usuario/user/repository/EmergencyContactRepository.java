package com.mediguard.usuario.user.repository;

import com.mediguard.usuario.user.entity.EmergencyContactEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmergencyContactRepository extends JpaRepository<EmergencyContactEntity, Long> {

    List<EmergencyContactEntity> findByUser_IdOrderByPrimaryContactDescNameAsc(UUID userId);

    Optional<EmergencyContactEntity> findByIdAndUser_Id(Long id, UUID userId);

    boolean existsByUser_IdAndPhone(UUID userId, String phone);

    boolean existsByUser_IdAndPhoneAndIdNot(UUID userId, String phone, Long id);
}
