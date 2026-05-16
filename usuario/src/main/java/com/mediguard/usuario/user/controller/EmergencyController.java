package com.mediguard.usuario.user.controller;

import com.mediguard.usuario.user.dto.EmergencyResponse;
import com.mediguard.usuario.user.service.EmergencyService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class EmergencyController {

    private final EmergencyService emergencyService;

    public EmergencyController(EmergencyService emergencyService) {
        this.emergencyService = emergencyService;
    }

    @GetMapping("/emergencies/")
    public ResponseEntity<List<EmergencyResponse>> getEmergencies() {
        return ResponseEntity.ok(emergencyService.getEmergencies());
    }
}
