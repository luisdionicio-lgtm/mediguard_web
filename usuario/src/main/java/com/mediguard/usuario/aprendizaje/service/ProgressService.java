package com.mediguard.usuario.aprendizaje.service;

import com.mediguard.usuario.aprendizaje.entity.EnrollmentEntity;
import com.mediguard.usuario.aprendizaje.entity.UserLessonProgressEntity;
import com.mediguard.usuario.aprendizaje.repository.EnrollmentRepository;
import com.mediguard.usuario.aprendizaje.repository.UserLessonProgressRepository;
import com.mediguard.usuario.user.entity.UserEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.NoSuchElementException;
import java.util.UUID;

@Service
@Transactional
public class ProgressService {

    private final UserLessonProgressRepository progressRepo;
    private final EnrollmentRepository enrollmentRepo;

    public ProgressService(UserLessonProgressRepository progressRepo,
            EnrollmentRepository enrollmentRepo) {
        this.progressRepo = progressRepo;
        this.enrollmentRepo = enrollmentRepo;
    }

    /**
     * Marca una lección como completada para un usuario.
     * Si es la última lección del curso, el trigger fn_auto_issue_certificate
     * emite el certificado y registra completed_at en enrollments automáticamente.
     */
    public UserLessonProgressEntity completeLesson(UUID userId, UUID courseId,
            UUID lessonId, Integer score) {
        EnrollmentEntity enrollment = enrollmentRepo
                .findByUser_IdAndCourseId(userId, courseId)
                .orElseThrow(() -> new NoSuchElementException("Inscripción no encontrada"));

        UserLessonProgressEntity progress = progressRepo
                .findByEnrollmentIdAndLessonId(enrollment.getId(), lessonId)
                .orElse(new UserLessonProgressEntity());

        progress.setEnrollment(enrollment);
        progress.setLessonId(lessonId);
        progress.setCompleted(true);
        progress.setScore(score);
        progress.setAttempts(progress.getAttempts() + 1);
        progress.setLastSeenAt(Instant.now());

        return progressRepo.save(progress);
    }

    public EnrollmentEntity enroll(UUID userId, UUID courseId, UserEntity user) {
        if (enrollmentRepo.existsByUser_IdAndCourseId(userId, courseId)) {
            return enrollmentRepo.findByUser_IdAndCourseId(userId, courseId).orElseThrow();
        }
        return enrollmentRepo.save(new EnrollmentEntity(user, courseId));
    }
}
