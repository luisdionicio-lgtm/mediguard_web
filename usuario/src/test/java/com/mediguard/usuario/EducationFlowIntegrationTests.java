package com.mediguard.usuario;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.mediguard.usuario.aprendizaje.repository.UserLessonProgressRepository;
import com.mediguard.usuario.user.repository.UserRepository;
import com.mediguard.usuario.user.repository.UserRoleRepository;
import java.util.UUID;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class EducationFlowIntegrationTests {

    private static final UUID COURSE_ID = UUID.fromString("10000000-0000-0000-0000-000000000001");
    private static final UUID OTHER_COURSE_ID = UUID.fromString("10000000-0000-0000-0000-000000000002");
    private static final UUID LESSON_ID = UUID.fromString("20000000-0000-0000-0000-000000000001");
    private static final UUID OTHER_COURSE_LESSON_ID = UUID.fromString("20000000-0000-0000-0000-000000000003");

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private UserLessonProgressRepository progressRepository;

    @BeforeEach
    void cleanTransactionalData() {
        jdbcTemplate.update("DELETE FROM verification_tokens");
        jdbcTemplate.update("DELETE FROM notification_log");
        jdbcTemplate.update("DELETE FROM user_device_tokens");
        jdbcTemplate.update("DELETE FROM certificates");
        jdbcTemplate.update("DELETE FROM user_lesson_progress");
        jdbcTemplate.update("DELETE FROM enrollments");
        userRoleRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void authenticatedUserCanEnrollInPublishedCourse() throws Exception {
        String token = registerAndLogin("student@example.com", "+51910000001");
        UUID userId = userId("student@example.com");

        mockMvc.perform(post("/api/enrollments/")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(enrollmentBody(COURSE_ID)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.user").value(userId.toString()))
                .andExpect(jsonPath("$.course").value(COURSE_ID.toString()))
                .andExpect(jsonPath("$.course_id").value(COURSE_ID.toString()))
                .andExpect(jsonPath("$.already_enrolled").value(false));
    }

    @Test
    void enrollingTwiceIsIdempotent() throws Exception {
        String token = registerAndLogin("duplicate@example.com", "+51910000002");
        String firstId = jsonValue(enroll(token, COURSE_ID), "id");

        mockMvc.perform(post("/api/enrollments/")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(enrollmentBody(COURSE_ID)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(firstId))
                .andExpect(jsonPath("$.already_enrolled").value(true));

        Integer count = jdbcTemplate.queryForObject(
                "SELECT COUNT(*) FROM enrollments WHERE user_id = ? AND course_id = ?",
                Integer.class,
                userId("duplicate@example.com"),
                COURSE_ID);
        org.junit.jupiter.api.Assertions.assertEquals(1, count);
    }

    @Test
    void authenticatedUserCanListOwnEnrollments() throws Exception {
        String token = registerAndLogin("list@example.com", "+51910000003");
        enroll(token, COURSE_ID);

        mockMvc.perform(get("/api/enrollments/{userId}/", userId("list@example.com"))
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].course").value(COURSE_ID.toString()));
    }

    @Test
    void userCannotListAnotherUsersEnrollments() throws Exception {
        String firstToken = registerAndLogin("owner-list@example.com", "+51910000004");
        registerAndLogin("other-list@example.com", "+51910000005");

        mockMvc.perform(get("/api/enrollments/{userId}/", userId("other-list@example.com"))
                .header(HttpHeaders.AUTHORIZATION, bearer(firstToken)))
                .andExpect(status().isForbidden())
                .andExpect(jsonPath("$.message").value("No puedes consultar inscripciones de otro usuario."));
    }

    @Test
    void userCanReadProgressForOwnEnrollment() throws Exception {
        String token = registerAndLogin("progress@example.com", "+51910000006");
        String enrollmentId = jsonValue(enroll(token, COURSE_ID), "id");

        mockMvc.perform(get("/api/progress/{enrollmentId}/", enrollmentId)
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void userCannotReadProgressForAnotherUsersEnrollment() throws Exception {
        String ownerToken = registerAndLogin("progress-owner@example.com", "+51910000007");
        String enrollmentId = jsonValue(enroll(ownerToken, COURSE_ID), "id");
        String intruderToken = registerAndLogin("progress-intruder@example.com", "+51910000008");

        mockMvc.perform(get("/api/progress/{enrollmentId}/", enrollmentId)
                .header(HttpHeaders.AUTHORIZATION, bearer(intruderToken)))
                .andExpect(status().isForbidden());
    }

    @Test
    void userCanCompleteLessonInOwnEnrollment() throws Exception {
        String token = registerAndLogin("complete@example.com", "+51910000009");
        String enrollmentId = jsonValue(enroll(token, COURSE_ID), "id");

        mockMvc.perform(put("/api/progress/{lessonId}/complete", LESSON_ID)
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(completeBody(enrollmentId, 88)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.enrollment_id").value(enrollmentId))
                .andExpect(jsonPath("$.lesson_id").value(LESSON_ID.toString()))
                .andExpect(jsonPath("$.completed").value(true))
                .andExpect(jsonPath("$.score").value(88))
                .andExpect(jsonPath("$.attempts").value(1));
    }

    @Test
    void completingSameLessonTwiceDoesNotDuplicateProgress() throws Exception {
        String token = registerAndLogin("idempotent@example.com", "+51910000010");
        String enrollmentId = jsonValue(enroll(token, COURSE_ID), "id");
        MvcResult first = complete(token, enrollmentId, LESSON_ID, 90);
        String firstProgressId = jsonValue(first, "id");

        mockMvc.perform(put("/api/progress/{lessonId}/complete", LESSON_ID)
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(completeBody(enrollmentId, 60)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(firstProgressId))
                .andExpect(jsonPath("$.attempts").value(1))
                .andExpect(jsonPath("$.score").value(90));

        org.junit.jupiter.api.Assertions.assertEquals(1, progressRepository.count());
    }

    @Test
    void missingCertificateReturnsControlledStatus() throws Exception {
        String token = registerAndLogin("no-certificate@example.com", "+51910000011");
        String enrollmentId = jsonValue(enroll(token, COURSE_ID), "id");

        mockMvc.perform(get("/api/certificates/{enrollmentId}/", enrollmentId)
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(false))
                .andExpect(jsonPath("$.message").value("El certificado aún no está disponible."))
                .andExpect(jsonPath("$.certificate").isEmpty());
    }

    @Test
    void existingCertificateIsReturnedToEnrollmentOwner() throws Exception {
        String token = registerAndLogin("certificate@example.com", "+51910000012");
        UUID enrollmentId = UUID.fromString(jsonValue(enroll(token, COURSE_ID), "id"));
        UUID certificateId = UUID.fromString("30000000-0000-0000-0000-000000000001");
        jdbcTemplate.update(
                "INSERT INTO certificates (id, enrollment_id, code, issued_at) VALUES (?, ?, ?, CURRENT_TIMESTAMP)",
                certificateId,
                enrollmentId,
                "CERT-TEST-001");

        mockMvc.perform(get("/api/certificates/{enrollmentId}/", enrollmentId)
                .header(HttpHeaders.AUTHORIZATION, bearer(token)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.available").value(true))
                .andExpect(jsonPath("$.message").value("Certificado disponible."))
                .andExpect(jsonPath("$.certificate.id").value(certificateId.toString()))
                .andExpect(jsonPath("$.certificate.enrollment_id").value(enrollmentId.toString()))
                .andExpect(jsonPath("$.certificate.code").value("CERT-TEST-001"));
    }

    @Test
    void transactionalEducationEndpointsRequireAuthentication() throws Exception {
        mockMvc.perform(post("/api/enrollments/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(enrollmentBody(COURSE_ID)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void enrollmentRejectsUnavailableCourseAndProgressRejectsForeignLesson() throws Exception {
        String token = registerAndLogin("catalog-validation@example.com", "+51910000013");

        mockMvc.perform(post("/api/enrollments/")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(enrollmentBody(OTHER_COURSE_ID)))
                .andExpect(status().isNotFound());

        String enrollmentId = jsonValue(enroll(token, COURSE_ID), "id");
        mockMvc.perform(put("/api/progress/{lessonId}/complete", OTHER_COURSE_LESSON_ID)
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(completeBody(enrollmentId, 100)))
                .andExpect(status().isBadRequest());
    }

    private MvcResult enroll(String token, UUID courseId) throws Exception {
        return mockMvc.perform(post("/api/enrollments/")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(enrollmentBody(courseId)))
                .andExpect(status().isCreated())
                .andReturn();
    }

    private MvcResult complete(String token, String enrollmentId, UUID lessonId, int score) throws Exception {
        return mockMvc.perform(put("/api/progress/{lessonId}/complete", lessonId)
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content(completeBody(enrollmentId, score)))
                .andExpect(status().isOk())
                .andReturn();
    }

    private String registerAndLogin(String email, String phone) throws Exception {
        mockMvc.perform(post("/api/register/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "first_name": "Education",
                          "last_name": "Student",
                          "email": "%s",
                          "phone": "%s",
                          "password": "super-secret",
                          "user_type": "PACIENTE"
                        }
                        """.formatted(email, phone)))
                .andExpect(status().isOk());

        MvcResult login = mockMvc.perform(post("/api/login/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "email": "%s",
                          "password": "super-secret"
                        }
                        """.formatted(email)))
                .andExpect(status().isOk())
                .andReturn();
        return jsonValue(login, "access_token");
    }

    private UUID userId(String email) {
        return userRepository.findByEmailIgnoreCase(email).orElseThrow().getId();
    }

    private String enrollmentBody(UUID courseId) {
        return """
                { "course_id": "%s" }
                """.formatted(courseId);
    }

    private String completeBody(String enrollmentId, int score) {
        return """
                {
                  "enrollment_id": "%s",
                  "score": %d
                }
                """.formatted(enrollmentId, score);
    }

    private String jsonValue(MvcResult result, String field) throws Exception {
        String json = result.getResponse().getContentAsString();
        String quotedField = "\"" + field + "\":";
        int fieldIndex = json.indexOf(quotedField);
        if (fieldIndex < 0) {
            throw new IllegalStateException("Missing JSON field: " + field);
        }
        int valueStart = fieldIndex + quotedField.length();
        while (valueStart < json.length() && Character.isWhitespace(json.charAt(valueStart))) {
            valueStart++;
        }
        if (valueStart >= json.length()) {
            throw new IllegalStateException("Missing JSON value for field: " + field);
        }
        if (json.charAt(valueStart) == '"') {
            int start = valueStart + 1;
            int end = json.indexOf('"', start);
            if (end < 0) {
                throw new IllegalStateException("Unterminated JSON value for field: " + field);
            }
            return json.substring(start, end);
        }
        int end = valueStart;
        while (end < json.length() && json.charAt(end) != ',' && json.charAt(end) != '}') {
            end++;
        }
        return json.substring(valueStart, end).trim();
    }

    private String bearer(String token) {
        return "Bearer " + token;
    }
}
