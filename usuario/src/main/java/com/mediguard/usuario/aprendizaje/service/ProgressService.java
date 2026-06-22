package com.mediguard.usuario.aprendizaje.service;

import com.mediguard.usuario.aprendizaje.entity.CertificateEntity;
import com.mediguard.usuario.aprendizaje.entity.EnrollmentEntity;
import com.mediguard.usuario.aprendizaje.entity.UserLessonProgressEntity;
import com.mediguard.usuario.aprendizaje.repository.CatalogCourseRepository;
import com.mediguard.usuario.aprendizaje.repository.CatalogLessonRepository;
import com.mediguard.usuario.aprendizaje.repository.CertificateRepository;
import com.mediguard.usuario.aprendizaje.repository.EnrollmentRepository;
import com.mediguard.usuario.aprendizaje.repository.UserLessonProgressRepository;
import com.mediguard.usuario.user.entity.UserEntity;
import com.mediguard.usuario.user.repository.UserRepository;
import java.time.Instant;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProgressService {

    private final UserLessonProgressRepository progressRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CertificateRepository certificateRepository;
    private final CatalogCourseRepository catalogCourseRepository;
    private final CatalogLessonRepository catalogLessonRepository;
    private final UserRepository userRepository;

    public ProgressService(
            UserLessonProgressRepository progressRepository,
            EnrollmentRepository enrollmentRepository,
            CertificateRepository certificateRepository,
            CatalogCourseRepository catalogCourseRepository,
            CatalogLessonRepository catalogLessonRepository,
            UserRepository userRepository) {
        this.progressRepository = progressRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.certificateRepository = certificateRepository;
        this.catalogCourseRepository = catalogCourseRepository;
        this.catalogLessonRepository = catalogLessonRepository;
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public List<EnrollmentEntity> listCurrentUserEnrollments(UUID requestedUserId) {
        UserEntity user = currentUser();
        if (!user.getId().equals(requestedUserId)) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No puedes consultar inscripciones de otro usuario.");
        }
        return enrollmentRepository.findAllByUser_IdOrderByEnrolledAtDesc(user.getId());
    }

    @Transactional
    public EnrollmentResult enrollCurrentUser(UUID courseId) {
        UserEntity user = currentUser();
        if (!catalogCourseRepository.existsByIdAndPublishedTrue(courseId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Curso no encontrado o no disponible.");
        }

        return enrollmentRepository.findByUser_IdAndCourseId(user.getId(), courseId)
                .map(enrollment -> new EnrollmentResult(enrollment, false))
                .orElseGet(() -> new EnrollmentResult(
                        enrollmentRepository.save(new EnrollmentEntity(user, courseId)),
                        true));
    }

    @Transactional(readOnly = true)
    public List<UserLessonProgressEntity> getCurrentUserProgress(UUID enrollmentId) {
        EnrollmentEntity enrollment = ownedEnrollment(enrollmentId);
        return progressRepository.findAllByEnrollmentIdOrderByLastSeenAtAsc(enrollment.getId());
    }

    @Transactional
    public UserLessonProgressEntity completeCurrentUserLesson(
            UUID enrollmentId,
            UUID lessonId,
            Integer requestedScore) {
        EnrollmentEntity enrollment = ownedEnrollment(enrollmentId);
        if (!catalogLessonRepository.existsByIdAndCourseId(lessonId, enrollment.getCourseId())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La lección no pertenece al curso de esta inscripción.");
        }

        var existing = progressRepository.findByEnrollmentIdAndLessonId(enrollmentId, lessonId);
        if (existing.isPresent() && existing.get().isCompleted()) {
            return existing.get();
        }

        UserLessonProgressEntity progress = existing.orElseGet(UserLessonProgressEntity::new);
        progress.setEnrollment(enrollment);
        progress.setLessonId(lessonId);
        progress.setCompleted(true);
        progress.setScore(requestedScore == null ? 100 : requestedScore);
        progress.setAttempts(progress.getAttempts() + 1);
        progress.setLastSeenAt(Instant.now());

        // El flush ejecuta el trigger PostgreSQL que puede emitir el certificado.
        return progressRepository.saveAndFlush(progress);
    }

    @Transactional(readOnly = true)
    public CertificateResult getCurrentUserCertificate(UUID enrollmentId) {
        EnrollmentEntity enrollment = ownedEnrollment(enrollmentId);
        CertificateEntity certificate = certificateRepository.findByEnrollmentId(enrollment.getId())
                .orElse(null);
        return new CertificateResult(enrollment, certificate);
    }

    private EnrollmentEntity ownedEnrollment(UUID enrollmentId) {
        UserEntity user = currentUser();
        EnrollmentEntity enrollment = enrollmentRepository.findById(enrollmentId)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Inscripción no encontrada."));
        if (!enrollment.getUser().getId().equals(user.getId())) {
            throw new ResponseStatusException(
                    HttpStatus.FORBIDDEN,
                    "No puedes consultar ni modificar una inscripción ajena.");
        }
        return enrollment;
    }

    private UserEntity currentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Autenticación requerida.");
        }
        return userRepository.findByEmailIgnoreCase(authentication.getName())
                .filter(user -> Boolean.TRUE.equals(user.getActive()))
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.UNAUTHORIZED,
                        "Usuario no encontrado."));
    }

    public record EnrollmentResult(EnrollmentEntity enrollment, boolean created) {
    }

    public record CertificateResult(EnrollmentEntity enrollment, CertificateEntity certificate) {
    }
}
