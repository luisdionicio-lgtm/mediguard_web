package com.mediguard.usuario.user.controller;

import com.mediguard.usuario.user.dto.ProfileResponse;
import com.mediguard.usuario.user.dto.ProfileUpdateRequest;
import com.mediguard.usuario.user.service.ProfileService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class ProfileController {

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/profile/")
    @PreAuthorize("hasAnyRole('CIUDADANO', 'SOCORRISTA', 'COORDINADOR', 'ADMIN')")
    public ResponseEntity<ProfileResponse> getProfile() {
        return ResponseEntity.ok(profileService.getCurrentProfile());
    }

    @PatchMapping("/profile/")
    @PreAuthorize("hasAnyRole('CIUDADANO', 'SOCORRISTA', 'COORDINADOR', 'ADMIN')")
    public ResponseEntity<ProfileResponse> updateProfile(
            @Valid @RequestBody ProfileUpdateRequest request) {
        return ResponseEntity.ok(profileService.updateCurrentProfile(request));
    }
}
