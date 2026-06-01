package com.mediguard.usuario.user.repository;

import com.mediguard.usuario.user.entity.UserEntity;
import java.util.Optional;
import java.util.UUID;
<<<<<<< HEAD
=======
import org.springframework.data.jpa.repository.EntityGraph;
>>>>>>> 92916b03964f6989ee835b660d14314239d117b0
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, UUID> {

<<<<<<< HEAD
    Optional<UserEntity> findByEmailIgnoreCase(String email);
=======
    @EntityGraph(attributePaths = {"userRoles", "userRoles.role"})
    Optional<UserEntity> findByEmailIgnoreCase(String email);

    boolean existsByEmailIgnoreCase(String email);

    boolean existsByPhone(String phone);
>>>>>>> 92916b03964f6989ee835b660d14314239d117b0
}
