package com.mediguard.usuario.user.repository;

import com.mediguard.usuario.user.entity.UserEntity;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

    @EntityGraph(attributePaths = {"userRoles", "userRoles.role"})
    Optional<UserEntity> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByPhone(String phone);
}
