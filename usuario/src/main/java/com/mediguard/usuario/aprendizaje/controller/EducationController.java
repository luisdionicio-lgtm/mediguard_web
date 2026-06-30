package com.mediguard.usuario.aprendizaje.controller;

import com.mediguard.usuario.aprendizaje.dto.CertificateResponse;
import com.mediguard.usuario.aprendizaje.dto.CertificateStatusResponse;
import com.mediguard.usuario.aprendizaje.dto.CompleteLessonRequest;
import com.mediguard.usuario.aprendizaje.dto.EnrollmentRequest;
import com.mediguard.usuario.aprendizaje.dto.EnrollmentResponse;
import com.mediguard.usuario.aprendizaje.dto.ProgressResponse;
import com.mediguard.usuario.aprendizaje.entity.EnrollmentEntity;
import com.mediguard.usuario.aprendizaje.entity.UserLessonProgressEntity;
import com.mediguard.usuario.aprendizaje.service.CertificatePdfService;
import com.mediguard.usuario.aprendizaje.service.ProgressService;
import jakarta.validation.Valid;
import java.util.List;
import java.util.UUID;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
@PreAuthorize("isAuthenticated()")
public class EducationController {

    private final ProgressService progressService;
    private final CertificatePdfService certificatePdfService;

    public EducationController(ProgressService progressService, CertificatePdfService certificatePdfService) {
        this.progressService = progressService;
        this.certificatePdfService = certificatePdfService;
    }

    @GetMapping("/enrollments/{userId}/")
    public List<EnrollmentResponse> listEnrollments(@PathVariable UUID userId) {
        return progressService.listCurrentUserEnrollments(userId).stream()
                .map(enrollment -> toEnrollmentResponse(enrollment, false))
                .toList();
    }

    @PostMapping("/enrollments/")
    public ResponseEntity<EnrollmentResponse> enroll(
            @Valid @RequestBody EnrollmentRequest request) {
        var result = progressService.enrollCurrentUser(request.courseId());
        EnrollmentResponse response = toEnrollmentResponse(result.enrollment(), !result.created());
        return ResponseEntity
                .status(result.created() ? HttpStatus.CREATED : HttpStatus.OK)
                .body(response);
    }

    @GetMapping("/progress/{enrollmentId}/")
    public List<ProgressResponse> getProgress(@PathVariable UUID enrollmentId) {
        return progressService.getCurrentUserProgress(enrollmentId).stream()
                .map(EducationController::toProgressResponse)
                .toList();
    }

    @PutMapping("/progress/{lessonId}/complete")
    public ProgressResponse completeLesson(
            @PathVariable UUID lessonId,
            @Valid @RequestBody CompleteLessonRequest request) {
        return toProgressResponse(progressService.completeCurrentUserLesson(
                request.enrollmentId(),
                lessonId,
                request.score()));
    }

    @GetMapping("/certificates/{enrollmentId}/")
    public CertificateStatusResponse getCertificate(@PathVariable UUID enrollmentId) {
        var result = progressService.getCurrentUserCertificate(enrollmentId);
        if (result.certificate() == null) {
            return new CertificateStatusResponse(
                    false,
                    "El certificado aún no está disponible.",
                    null);
        }
        var certificate = result.certificate();
        return new CertificateStatusResponse(
                true,
                "Certificado disponible.",
                new CertificateResponse(
                        certificate.getId(),
                        result.enrollment().getId(),
                        certificate.getCode(),
                        certificate.getIssuedAt()));
    }

    @GetMapping("/certificates/{enrollmentId}/download/")
    public ResponseEntity<byte[]> downloadCertificate(@PathVariable UUID enrollmentId) {
        var download = progressService.getCurrentUserCertificateForDownload(enrollmentId);
        byte[] pdf = certificatePdfService.generate(
                download.user(), download.courseTitle(), download.certificate());

        String filename = "certificado-" + download.certificate().getCode().substring(0, 8) + ".pdf";
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        ContentDisposition.attachment().filename(filename).build().toString())
                .body(pdf);
    }

    private static EnrollmentResponse toEnrollmentResponse(
            EnrollmentEntity enrollment,
            boolean alreadyEnrolled) {
        return new EnrollmentResponse(
                enrollment.getId(),
                enrollment.getUser().getId(),
                enrollment.getCourseId(),
                enrollment.getCourseId(),
                enrollment.getEnrolledAt(),
                enrollment.getCompletedAt(),
                alreadyEnrolled);
    }

    private static ProgressResponse toProgressResponse(UserLessonProgressEntity progress) {
        return new ProgressResponse(
                progress.getId(),
                progress.getEnrollment().getId(),
                progress.getLessonId(),
                progress.isCompleted(),
                progress.getScore(),
                progress.getAttempts(),
                progress.getLastSeenAt());
    }
}
