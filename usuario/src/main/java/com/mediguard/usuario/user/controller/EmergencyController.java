package com.mediguard.usuario.user.controller;

import com.mediguard.usuario.user.dto.EmergencyContactRequest;
import com.mediguard.usuario.user.dto.EmergencyContactResponse;
import com.mediguard.usuario.user.dto.EmergencyResponse;
import com.mediguard.usuario.user.dto.SosEventRequest;
import com.mediguard.usuario.user.dto.SosEventResponse;
import com.mediguard.usuario.user.service.EmergencyService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @GetMapping("/emergency-numbers/")
    public ResponseEntity<List<EmergencyResponse>> getEmergencyNumbers() {
        return ResponseEntity.ok(emergencyService.getEmergencies());
    }

    @GetMapping("/emergency-contacts/")
    public ResponseEntity<List<EmergencyContactResponse>> getContacts() {
        return ResponseEntity.ok(emergencyService.getContacts());
    }

    @PostMapping("/emergency-contacts/")
    public ResponseEntity<EmergencyContactResponse> createContact(
            @Valid @RequestBody EmergencyContactRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(emergencyService.createContact(request));
    }

    @PutMapping("/emergency-contacts/{id}/")
    public ResponseEntity<EmergencyContactResponse> updateContact(
            @PathVariable Long id,
            @Valid @RequestBody EmergencyContactRequest request) {
        return ResponseEntity.ok(emergencyService.updateContact(id, request));
    }

    @DeleteMapping("/emergency-contacts/{id}/")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        emergencyService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/sos-events/")
    public ResponseEntity<List<SosEventResponse>> getSosEvents() {
        return ResponseEntity.ok(emergencyService.getSosEvents());
    }

    @PostMapping("/sos-events/")
    public ResponseEntity<SosEventResponse> createSosEvent(
            @Valid @RequestBody SosEventRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(emergencyService.createSosEvent(request));
    }

    @PatchMapping("/sos-events/{id}/")
    public ResponseEntity<SosEventResponse> updateSosEvent(
            @PathVariable Long id,
            @Valid @RequestBody SosEventRequest request) {
        return ResponseEntity.ok(emergencyService.updateSosEvent(id, request));
    }
}
