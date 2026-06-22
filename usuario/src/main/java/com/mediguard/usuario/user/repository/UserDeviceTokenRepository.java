package com.mediguard.usuario.user.repository;

import com.mediguard.usuario.user.entity.UserDeviceTokenEntity;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserDeviceTokenRepository extends JpaRepository<UserDeviceTokenEntity, UUID> {

    List<UserDeviceTokenEntity> findAllByUser_IdOrderByUpdatedAtDesc(UUID userId);

    Optional<UserDeviceTokenEntity> findByProviderAndToken(String provider, String token);

    Optional<UserDeviceTokenEntity> findByIdAndUser_Id(UUID id, UUID userId);
}
