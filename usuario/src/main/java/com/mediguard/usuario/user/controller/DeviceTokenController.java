package com.mediguard.usuario.user.controller;

import com.mediguard.usuario.user.dto.DeviceTokenRequest;
import com.mediguard.usuario.user.dto.DeviceTokenResponse;
import com.mediguard.usuario.user.service.DeviceTokenService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/device-tokens")
@PreAuthorize("isAuthenticated()")
public class DeviceTokenController {

    private final DeviceTokenService deviceTokenService;

    public DeviceTokenController(DeviceTokenService deviceTokenService) {
        this.deviceTokenService = deviceTokenService;
    }

    @PostMapping("/")
    public ResponseEntity<DeviceTokenResponse> register(
            @Valid @RequestBody DeviceTokenRequest request) {
        var result = deviceTokenService.register(request);
        return ResponseEntity
                .status(result.created() ? HttpStatus.CREATED : HttpStatus.OK)
                .body(result.response());
    }

    @GetMapping("/")
    public List<DeviceTokenResponse> list() {
        return deviceTokenService.listCurrentUserTokens();
    }

    @DeleteMapping("/{id}/")
    public ResponseEntity<Void> deactivate(@PathVariable UUID id) {
        deviceTokenService.deactivate(id);
        return ResponseEntity.noContent().build();
    }
}
