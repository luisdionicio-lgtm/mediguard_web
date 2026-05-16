package com.mediguard.usuario.user.service;

import com.mediguard.usuario.user.dto.EmergencyResponse;
import com.mediguard.usuario.user.entity.EmergencyEntity;
import com.mediguard.usuario.user.repository.EmergencyRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class EmergencyService {

    private final EmergencyRepository emergencyRepository;

    public EmergencyService(EmergencyRepository emergencyRepository) {
        this.emergencyRepository = emergencyRepository;
    }

    public List<EmergencyResponse> getEmergencies() {
        return emergencyRepository.findByActiveTrueOrderByPriorityAscNameAsc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private EmergencyResponse toResponse(EmergencyEntity emergency) {
        return new EmergencyResponse(
                emergency.getId(),
                emergency.getName(),
                emergency.getPhone(),
                emergency.getServiceType(),
                emergency.getCountryCode(),
                emergency.getPriority()
        );
    }
}
