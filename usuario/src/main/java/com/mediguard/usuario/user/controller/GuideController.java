package com.mediguard.usuario.user.controller;

import com.mediguard.usuario.user.dto.GuideResponse;
import com.mediguard.usuario.user.service.GuideService;
import java.util.List;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class GuideController {

    private final GuideService guideService;

    public GuideController(GuideService guideService) {
        this.guideService = guideService;
    }

    @GetMapping("/guides/")
    public ResponseEntity<List<GuideResponse>> getGuides() {
        return ResponseEntity.ok(guideService.getGuides());
    }
}
