package com.mediguard.usuario.user.repository;

import com.mediguard.usuario.user.entity.EmergencyEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EmergencyRepository extends JpaRepository<EmergencyEntity, Long> {

    List<EmergencyEntity> findByActiveTrueOrderByPriorityAscNameAsc();
}
