package com.mediguard.usuario.user.repository;

import com.mediguard.usuario.user.entity.VerificationTokenEntity;
import com.mediguard.usuario.user.entity.VerificationTokenEntity.TokenType;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface VerificationTokenRepository extends JpaRepository<VerificationTokenEntity, UUID> {

    Optional<VerificationTokenEntity> findByTokenAndUsedFalse(String token);

    Optional<VerificationTokenEntity> findTopByUserIdAndTokenTypeAndUsedFalseOrderByCreatedAtDesc(
            UUID userId, TokenType tokenType);
}
