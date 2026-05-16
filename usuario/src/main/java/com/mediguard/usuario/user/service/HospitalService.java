package com.mediguard.usuario.user.service;

import com.mediguard.usuario.user.dto.HospitalResponse;
import com.mediguard.usuario.user.entity.HospitalEntity;
import com.mediguard.usuario.user.repository.HospitalRepository;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class HospitalService {

    private final HospitalRepository hospitalRepository;

    public HospitalService(HospitalRepository hospitalRepository) {
        this.hospitalRepository = hospitalRepository;
    }

    public List<HospitalResponse> getHospitals() {
        return hospitalRepository.findByActiveTrueOrderByNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private HospitalResponse toResponse(HospitalEntity hospital) {
        return new HospitalResponse(
                hospital.getId(),
                hospital.getName(),
                hospital.getAddress(),
                hospital.getPhone(),
                toDouble(hospital.getLatitude()),
                toDouble(hospital.getLongitude())
        );
    }

    private Double toDouble(BigDecimal value) {
        return value == null ? null : value.doubleValue();
    }
}
