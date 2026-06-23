package com.mediguard.usuario;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.mediguard.usuario.user.repository.EmergencyContactRepository;
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
class DeviceTokenIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private SosEventRepository sosEventRepository;

    @Autowired
    private EmergencyContactRepository emergencyContactRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

    @Autowired
    private UserRepository userRepository;

    @BeforeEach
    void cleanDatabase() {
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
    void userRegistersAndListsOnlyOwnDeviceTokens() throws Exception {
        AuthTokens owner = registerAndLogin("device-owner@example.com", "+51930000001");
        AuthTokens other = registerAndLogin("device-other@example.com", "+51930000002");

        registerToken(owner.accessToken(), "fcm-owner-token-1234567890", "Pixel 9")
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.provider").value("FCM"))
                .andExpect(jsonPath("$.platform").value("ANDROID"))
                .andExpect(jsonPath("$.token_preview").value("fcm-ow...7890"))
                .andExpect(jsonPath("$.token").doesNotExist());
        registerToken(other.accessToken(), "fcm-other-token-1234567890", "Otro teléfono")
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/device-tokens/")
                .header(HttpHeaders.AUTHORIZATION, bearer(owner.accessToken())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].device_name").value("Pixel 9"));
    }

    @Test
    void userDeactivatesAndReactivatesOwnTokenIdempotently() throws Exception {
        AuthTokens owner = registerAndLogin("device-reactivate@example.com", "+51930000003");
        MvcResult created = registerToken(
                owner.accessToken(),
                "fcm-reactivate-token-1234567890",
                "Teléfono principal")
                .andExpect(status().isCreated())
                .andReturn();
        String tokenId = jsonValue(created, "id");

        mockMvc.perform(delete("/api/device-tokens/{id}/", tokenId)
                .header(HttpHeaders.AUTHORIZATION, bearer(owner.accessToken())))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/device-tokens/")
                .header(HttpHeaders.AUTHORIZATION, bearer(owner.accessToken())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].active").value(false));

        registerToken(owner.accessToken(), "fcm-reactivate-token-1234567890", "Teléfono renovado")
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(tokenId))
                .andExpect(jsonPath("$.active").value(true))
                .andExpect(jsonPath("$.device_name").value("Teléfono renovado"));
    }

    @Test
    void userCannotDeleteAnotherUsersToken() throws Exception {
        AuthTokens owner = registerAndLogin("device-delete-owner@example.com", "+51930000004");
        AuthTokens intruder = registerAndLogin("device-delete-intruder@example.com", "+51930000005");
        MvcResult created = registerToken(
                owner.accessToken(),
                "fcm-protected-token-1234567890",
                "Protegido")
                .andExpect(status().isCreated())
                .andReturn();

        mockMvc.perform(delete("/api/device-tokens/{id}/", jsonValue(created, "id"))
                .header(HttpHeaders.AUTHORIZATION, bearer(intruder.accessToken())))
                .andExpect(status().isNotFound());
    }

    @Test
    void emptyDeviceTokenIsRejected() throws Exception {
        AuthTokens owner = registerAndLogin("device-invalid@example.com", "+51930000006");

        mockMvc.perform(post("/api/device-tokens/")
                .header(HttpHeaders.AUTHORIZATION, bearer(owner.accessToken()))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "provider": "FCM",
                          "token": " ",
                          "platform": "ANDROID"
                        }
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.token").exists());
    }

    @Test
    void deviceTokenEndpointsRejectAnonymousAndRefreshBearer() throws Exception {
        mockMvc.perform(get("/api/device-tokens/"))
                .andExpect(status().isUnauthorized());

        AuthTokens owner = registerAndLogin("device-refresh@example.com", "+51930000007");
        registerToken(owner.refreshToken(), "fcm-refresh-token-1234567890", "No permitido")
                .andExpect(status().isUnauthorized());
    }

    private org.springframework.test.web.servlet.ResultActions registerToken(
            String bearerToken,
            String deviceToken,
            String deviceName) throws Exception {
        return mockMvc.perform(post("/api/device-tokens/")
                .header(HttpHeaders.AUTHORIZATION, bearer(bearerToken))
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "provider": "FCM",
                          "token": "%s",
                          "platform": "ANDROID",
                          "device_name": "%s"
                        }
                        """.formatted(deviceToken, deviceName)));
    }

    private AuthTokens registerAndLogin(String email, String phone) throws Exception {
        mockMvc.perform(post("/api/register/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "first_name": "Mobile",
                          "last_name": "Tester",
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
        return new AuthTokens(
                jsonValue(login, "access_token"),
                jsonValue(login, "refresh_token"));
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

    private record AuthTokens(String accessToken, String refreshToken) {
    }
}
