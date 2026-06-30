package com.mediguard.usuario;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.mediguard.usuario.user.repository.EmergencyContactRepository;
import com.mediguard.usuario.user.repository.NotificationLogRepository;
import com.mediguard.usuario.user.repository.SosEventRepository;
import com.mediguard.usuario.user.repository.UserRepository;
import com.mediguard.usuario.user.repository.UserRoleRepository;
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
class EmergencyFlowIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EmergencyContactRepository emergencyContactRepository;

    @Autowired
    private NotificationLogRepository notificationLogRepository;

    @Autowired
    private SosEventRepository sosEventRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @BeforeEach
    void cleanDatabase() {
        jdbcTemplate.update("DELETE FROM verification_tokens");
        jdbcTemplate.update("DELETE FROM notification_log");
        jdbcTemplate.update("DELETE FROM user_device_tokens");
        jdbcTemplate.update("DELETE FROM certificates");
        jdbcTemplate.update("DELETE FROM user_lesson_progress");
        jdbcTemplate.update("DELETE FROM enrollments");
        sosEventRepository.deleteAll();
        emergencyContactRepository.deleteAll();
        userRoleRepository.deleteAll();
        userRepository.deleteAll();
    }

    @Test
    void authenticatedUserCreatesAndListsOnlyOwnContacts() throws Exception {
        AuthTokens owner = registerAndLogin("contacts-owner@example.com", "+51920000001", "PACIENTE");
        AuthTokens other = registerAndLogin("contacts-other@example.com", "+51920000002", "PACIENTE");

        createContact(owner.accessToken(), "Contacto propio", "+51921111111", "familiar")
                .andExpect(status().isCreated());
        createContact(other.accessToken(), "Contacto ajeno", "+51922222222", "amigo")
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/emergency-contacts/")
                .header(HttpHeaders.AUTHORIZATION, bearer(owner.accessToken())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].name").value("Contacto propio"))
                .andExpect(jsonPath("$[0].phone").value("+51921111111"));
    }

    @Test
    void duplicatePhoneForSameUserIsRejected() throws Exception {
        AuthTokens owner = registerAndLogin("contacts-duplicate@example.com", "+51920000003", "PACIENTE");
        createContact(owner.accessToken(), "Contacto uno", "+51923333333", "familiar")
                .andExpect(status().isCreated());

        createContact(owner.accessToken(), "Contacto repetido", "+51923333333", "amigo")
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.phone[0]")
                        .value("El teléfono del contacto de emergencia ya está registrado."));
    }

    @Test
    void invalidContactFieldsAreRejected() throws Exception {
        AuthTokens owner = registerAndLogin("contacts-validation@example.com", "+51920000004", "PACIENTE");

        mockMvc.perform(post("/api/emergency-contacts/")
                .header(HttpHeaders.AUTHORIZATION, bearer(owner.accessToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "name": "",
                          "phone": "123",
                          "relationship": "desconocido"
                        }
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.name").exists())
                .andExpect(jsonPath("$.errors.phone").exists())
                .andExpect(jsonPath("$.errors.relationship").exists());
    }

    @Test
    void userCannotUpdateOrDeleteAnotherUsersContact() throws Exception {
        AuthTokens owner = registerAndLogin("contact-real-owner@example.com", "+51920000005", "PACIENTE");
        AuthTokens intruder = registerAndLogin("contact-intruder@example.com", "+51920000006", "PACIENTE");
        MvcResult created = createContact(
                owner.accessToken(),
                "Contacto protegido",
                "+51924444444",
                "vecino")
                .andExpect(status().isCreated())
                .andReturn();
        String contactId = jsonValue(created, "id");

        mockMvc.perform(put("/api/emergency-contacts/{id}/", contactId)
                .header(HttpHeaders.AUTHORIZATION, bearer(intruder.accessToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "name": "Contacto alterado",
                          "phone": "+51925555555",
                          "relationship": "otro"
                        }
                        """))
                .andExpect(status().isNotFound());

        mockMvc.perform(delete("/api/emergency-contacts/{id}/", contactId)
                .header(HttpHeaders.AUTHORIZATION, bearer(intruder.accessToken())))
                .andExpect(status().isNotFound());
    }

    @Test
    void authenticatedUserCreatesSosWithCoordinatesAndNoOpNotificationSummary() throws Exception {
        AuthTokens citizen = registerAndLogin("sos-location@example.com", "+51920000007", "PACIENTE");
        createContact(citizen.accessToken(), "Contacto uno", "+51926666661", "familiar")
                .andExpect(status().isCreated());
        createContact(citizen.accessToken(), "Contacto dos", "+51926666662", "amigo")
                .andExpect(status().isCreated());

        mockMvc.perform(post("/api/sos-events/")
                .header(HttpHeaders.AUTHORIZATION, bearer(citizen.accessToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "latitude": -12.046374,
                          "longitude": -77.042793,
                          "notes": "SOS con ubicación",
                          "device": "integration-test",
                          "notified_contacts": 99
                        }
                        """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.status").value("activado"))
                .andExpect(jsonPath("$.location_available").value(true))
                .andExpect(jsonPath("$.contacts_found").value(2))
                .andExpect(jsonPath("$.notifiable_contacts").value(2))
                .andExpect(jsonPath("$.simulated_contacts").value(2))
                .andExpect(jsonPath("$.notified_contacts").value(0))
                .andExpect(jsonPath("$.real_notification_enabled").value(false))
                .andExpect(jsonPath("$.notification_status").value("SIMULATED_ONLY"));

        org.junit.jupiter.api.Assertions.assertEquals(2, notificationLogRepository.count());
        org.junit.jupiter.api.Assertions.assertTrue(notificationLogRepository.findAll().stream()
                .allMatch(log -> "NOOP".equals(log.getProvider())
                        && "NOOP".equals(log.getChannel())
                        && "SIMULATED".equals(log.getStatus())
                        && log.getSentAt() == null));
    }

    @Test
    void authenticatedUserCreatesSosWithoutCoordinates() throws Exception {
        AuthTokens citizen = registerAndLogin("sos-no-location@example.com", "+51920000008", "PACIENTE");

        mockMvc.perform(post("/api/sos-events/")
                .header(HttpHeaders.AUTHORIZATION, bearer(citizen.accessToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"notes\":\"SOS sin ubicación\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.location_available").value(false))
                .andExpect(jsonPath("$.latitude").isEmpty())
                .andExpect(jsonPath("$.longitude").isEmpty())
                .andExpect(jsonPath("$.contacts_found").value(0))
                .andExpect(jsonPath("$.notified_contacts").value(0));
    }

    @Test
    void sosAndContactsRequireAuthentication() throws Exception {
        mockMvc.perform(get("/api/emergency-contacts/"))
                .andExpect(status().isUnauthorized());
        mockMvc.perform(post("/api/sos-events/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void responderListsGlobalSosWhileCitizenCannot() throws Exception {
        AuthTokens citizen = registerAndLogin("sos-citizen@example.com", "+51920000009", "PACIENTE");
        AuthTokens responder = registerAndLogin("sos-responder@example.com", "+51920000010", "CUIDADOR");
        createSos(citizen.accessToken(), "SOS visible para operaciones")
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/sos-events/")
                .header(HttpHeaders.AUTHORIZATION, bearer(citizen.accessToken())))
                .andExpect(status().isForbidden());

        mockMvc.perform(get("/api/sos-events/")
                .header(HttpHeaders.AUTHORIZATION, bearer(responder.accessToken())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].user_id").value(citizen.userId()));
    }

    @Test
    void coordinatorUpdatesCitizenSosStatus() throws Exception {
        AuthTokens citizen = registerAndLogin("sos-update-owner@example.com", "+51920000011", "PACIENTE");
        AuthTokens coordinator = registerAndLogin("sos-coordinator@example.com", "+51920000012", "MEDICO");
        MvcResult created = createSos(citizen.accessToken(), "SOS para resolver")
                .andExpect(status().isCreated())
                .andReturn();
        String eventId = jsonValue(created, "id");

        mockMvc.perform(patch("/api/sos-events/{id}/", eventId)
                .header(HttpHeaders.AUTHORIZATION, bearer(coordinator.accessToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "status": "resuelto",
                          "notes": "Atendido por coordinación"
                        }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("resuelto"))
                .andExpect(jsonPath("$.user_id").value(citizen.userId()))
                .andExpect(jsonPath("$.resolved_at").isNotEmpty());
    }

    @Test
    void refreshTokenCannotCreateSosAsBearer() throws Exception {
        AuthTokens citizen = registerAndLogin("sos-refresh@example.com", "+51920000013", "PACIENTE");

        mockMvc.perform(post("/api/sos-events/")
                .header(HttpHeaders.AUTHORIZATION, bearer(citizen.refreshToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    private org.springframework.test.web.servlet.ResultActions createContact(
            String token,
            String name,
            String phone,
            String relationship) throws Exception {
        return mockMvc.perform(post("/api/emergency-contacts/")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "name": "%s",
                          "phone": "%s",
                          "relationship": "%s",
                          "is_primary": false
                        }
                        """.formatted(name, phone, relationship)));
    }

    private org.springframework.test.web.servlet.ResultActions createSos(
            String token,
            String notes) throws Exception {
        return mockMvc.perform(post("/api/sos-events/")
                .header(HttpHeaders.AUTHORIZATION, bearer(token))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "notes": "%s" }
                        """.formatted(notes)));
    }

    private AuthTokens registerAndLogin(String email, String phone, String userType) throws Exception {
        mockMvc.perform(post("/api/register/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "first_name": "Emergency",
                          "last_name": "Tester",
                          "email": "%s",
                          "phone": "%s",
                          "password": "super-secret",
                          "user_type": "%s"
                        }
                        """.formatted(email, phone, userType)))
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

        return new AuthTokens(
                jsonValue(login, "access_token"),
                jsonValue(login, "refresh_token"),
                jsonValue(login, "id"));
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
        if (json.charAt(valueStart) == '"') {
            int start = valueStart + 1;
            int end = json.indexOf('"', start);
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

    private record AuthTokens(String accessToken, String refreshToken, String userId) {
    }
}
