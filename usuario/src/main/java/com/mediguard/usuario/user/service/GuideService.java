package com.mediguard.usuario.user.service;

import com.mediguard.usuario.user.dto.GuideResponse;
import com.mediguard.usuario.user.entity.GuideEntity;
import com.mediguard.usuario.user.repository.GuideRepository;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class GuideService {

    private final GuideRepository guideRepository;

    public GuideService(GuideRepository guideRepository) {
        this.guideRepository = guideRepository;
    }

    public List<GuideResponse> getGuides() {
        return guideRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toResponse)
                .toList();
    }

    private GuideResponse toResponse(GuideEntity guide) {
        return new GuideResponse(
                guide.getId(),
                guide.getTitle(),
                guide.getDescription(),
                guide.getCategory(),
                guide.getContent()
        );
    }
}
