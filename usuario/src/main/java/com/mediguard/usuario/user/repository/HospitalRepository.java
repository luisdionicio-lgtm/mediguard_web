package com.mediguard.usuario.user.repository;

import com.mediguard.usuario.user.entity.HospitalEntity;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface HospitalRepository extends JpaRepository<HospitalEntity, Long> {

    List<HospitalEntity> findByActiveTrueOrderByNameAsc();
}
