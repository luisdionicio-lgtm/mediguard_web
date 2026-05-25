package com.mediguard.usuario.user.controller;

import com.mediguard.usuario.user.dto.HospitalResponse;
import com.mediguard.usuario.user.service.HospitalService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HospitalController {

    private final HospitalService hospitalService;

    public HospitalController(HospitalService hospitalService) {
        this.hospitalService = hospitalService;
    }

    @GetMapping("/hospitals/")
    public ResponseEntity<List<HospitalResponse>> getHospitals() {
        return ResponseEntity.ok(hospitalService.getHospitals());
    }
}
