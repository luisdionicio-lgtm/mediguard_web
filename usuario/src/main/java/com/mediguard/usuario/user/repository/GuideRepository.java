package com.mediguard.usuario.user.repository;

import com.mediguard.usuario.user.entity.GuideEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GuideRepository extends JpaRepository<GuideEntity, Long> {

    List<GuideEntity> findAllByOrderByCreatedAtDesc();
}
