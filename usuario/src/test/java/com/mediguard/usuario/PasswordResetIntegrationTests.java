package com.mediguard.usuario;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.mediguard.usuario.user.entity.VerificationTokenEntity.TokenType;
import com.mediguard.usuario.user.repository.EmergencyContactRepository;
import com.mediguard.usuario.user.repository.SosEventRepository;
import com.mediguard.usuario.user.repository.UserRepository;
import com.mediguard.usuario.user.repository.UserRoleRepository;
import com.mediguard.usuario.user.repository.VerificationTokenRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class PasswordResetIntegrationTests {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private VerificationTokenRepository verificationTokenRepository;

    @Autowired
    private SosEventRepository sosEventRepository;

    @Autowired
    private EmergencyContactRepository emergencyContactRepository;

    @Autowired
    private UserRoleRepository userRoleRepository;

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
    void forgotPasswordAlwaysReturnsGenericMessageAndCreatesTokenWhenEmailExists() throws Exception {
        register("reset-owner@example.com", "+51930000101");

        mockMvc.perform(post("/api/forgot-password/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "email": "reset-owner@example.com" }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value(
                        "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."));

        var user = userRepository.findByEmailIgnoreCase("reset-owner@example.com").orElseThrow();
        var token = verificationTokenRepository
                .findTopByUserIdAndTokenTypeAndUsedFalseOrderByCreatedAtDesc(user.getId(), TokenType.PASSWORD_RESET)
                .orElseThrow();
        org.junit.jupiter.api.Assertions.assertEquals(64, token.getToken().length());
        org.junit.jupiter.api.Assertions.assertFalse(token.isUsed());
    }

    @Test
    void forgotPasswordReturnsSameGenericMessageWhenEmailDoesNotExist() throws Exception {
        mockMvc.perform(post("/api/forgot-password/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "email": "no-existe@example.com" }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value(
                        "Si el correo está registrado, recibirás un enlace para restablecer tu contraseña."));
    }

    @Test
    void resetPasswordWithValidTokenChangesPasswordAndAllowsNewLogin() throws Exception {
        register("reset-flow@example.com", "+51930000102");

        mockMvc.perform(post("/api/forgot-password/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "email": "reset-flow@example.com" }
                        """))
                .andExpect(status().isOk());

        var user = userRepository.findByEmailIgnoreCase("reset-flow@example.com").orElseThrow();
        var token = verificationTokenRepository
                .findTopByUserIdAndTokenTypeAndUsedFalseOrderByCreatedAtDesc(user.getId(), TokenType.PASSWORD_RESET)
                .orElseThrow();

        mockMvc.perform(post("/api/reset-password/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "token": "%s", "new_password": "nueva-clave-123" }
                        """.formatted(token.getToken())))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.message").value("Contraseña actualizada correctamente."));

        mockMvc.perform(post("/api/login/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "email": "reset-flow@example.com", "password": "nueva-clave-123" }
                        """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.access_token").isString());

        mockMvc.perform(post("/api/login/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "email": "reset-flow@example.com", "password": "super-secret" }
                        """))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void resetPasswordRejectsAlreadyUsedToken() throws Exception {
        register("reset-reuse@example.com", "+51930000103");
        mockMvc.perform(post("/api/forgot-password/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "email": "reset-reuse@example.com" }
                        """));

        var user = userRepository.findByEmailIgnoreCase("reset-reuse@example.com").orElseThrow();
        var token = verificationTokenRepository
                .findTopByUserIdAndTokenTypeAndUsedFalseOrderByCreatedAtDesc(user.getId(), TokenType.PASSWORD_RESET)
                .orElseThrow();

        String resetBody = """
                { "token": "%s", "new_password": "primera-clave-123" }
                """.formatted(token.getToken());

        mockMvc.perform(post("/api/reset-password/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(resetBody))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/reset-password/")
                .contentType(MediaType.APPLICATION_JSON)
                .content(resetBody))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.token[0]").value(containsString("no es válido")));
    }

    @Test
    void resetPasswordRejectsUnknownToken() throws Exception {
        mockMvc.perform(post("/api/reset-password/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        { "token": "token-inventado", "new_password": "cualquier-clave-123" }
                        """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.errors.token").exists());
    }

    private void register(String email, String phone) throws Exception {
        mockMvc.perform(post("/api/register/")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                        {
                          "first_name": "Reset",
                          "last_name": "Tester",
                          "email": "%s",
                          "phone": "%s",
                          "password": "super-secret",
                          "user_type": "PACIENTE"
                        }
                        """.formatted(email, phone)))
                .andExpect(status().isOk());
    }
}
