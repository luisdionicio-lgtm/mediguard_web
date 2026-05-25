package com.mediguard.usuario.user.service;

import com.mediguard.usuario.user.dto.ProfileResponse;
import com.mediguard.usuario.user.entity.UserEntity;
import java.util.List;
import org.springframework.stereotype.Component;

@Component
public class ProfileMapper {

    public ProfileResponse toResponse(UserEntity user) {
        return new ProfileResponse(
                user.getId(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail(),
                user.getPhone(),
                user.getAvatarUrl(),
                user.getBio(),
                roles(user));
    }

    public List<String> roles(UserEntity user) {
        if (user.getUserRoles() == null) {
            return List.of();
        }
        return user.getUserRoles().stream()
                .filter(userRole -> userRole.getRole() != null)
                .map(userRole -> userRole.getRole().getName())
                .distinct()
                .sorted()
                .toList();
    }
}
