package com.mediguard.usuario;

import com.mediguard.usuario.user.repository.EmergencyContactRepository;
import com.mediguard.usuario.user.repository.SosEventRepository;
import com.mediguard.usuario.user.repository.UserRepository;
import com.mediguard.usuario.user.repository.UserRoleRepository;
import com.mediguard.usuario.user.security.JwtService;
import java.util.List;
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
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class UserFlowIntegrationTests {

  @Autowired
  private MockMvc mockMvc;

  @Autowired
  private SosEventRepository sosEventRepository;

  @Autowired
  private EmergencyContactRepository emergencyContactRepository;

  @Autowired
  private UserRepository userRepository;

  @Autowired
  private UserRoleRepository userRoleRepository;

  @Autowired
  private JwtService jwtService;

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
  void loginSucceedsWithValidCredentials() throws Exception {
    register("ana@example.com", "+51900111001");

    mockMvc.perform(post("/api/login/")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "ana@example.com",
              "password": "super-secret"
            }
            """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.access_token").isString())
        .andExpect(jsonPath("$.refresh_token").isString())
        .andExpect(jsonPath("$.user.email").value("ana@example.com"));
  }

  @Test
  void registerWithBrowserOriginReachesControllerAndReturnsJson() throws Exception {
    mockMvc.perform(post("/api/register/")
        .header(HttpHeaders.ORIGIN, "http://localhost:5173")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "first_name": "Browser",
              "last_name": "User",
              "email": "browser-register@example.com",
              "phone": "+51900111007",
              "password": "super-secret"
            }
            """))
        .andExpect(status().isOk())
        .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, "http://localhost:5173"))
        .andExpect(jsonPath("$.access_token").isString())
        .andExpect(jsonPath("$.user.email").value("browser-register@example.com"))
        .andExpect(jsonPath("$.user.roles[0]").value("CIUDADANO"));
  }

  @Test
  void duplicateRegisterReturnsStandardJsonErrorInsteadOfEmptyForbidden() throws Exception {
    register("duplicate-register@example.com", "+51900111008");

    mockMvc.perform(post("/api/register/")
        .header(HttpHeaders.ORIGIN, "http://localhost:5173")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "first_name": "Duplicate",
              "last_name": "User",
              "email": "duplicate-register@example.com",
              "phone": "+51900111009",
              "password": "super-secret"
            }
            """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Error de validación"))
        .andExpect(jsonPath("$.errors.email[0]").value("El correo ya está registrado."));
  }

  @Test
  void loginRejectsInvalidCredentials() throws Exception {
    register("bad-login@example.com", "+51900111002");

    mockMvc.perform(post("/api/login/")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "bad-login@example.com",
              "password": "wrong-password"
            }
            """))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Correo o contraseña inválidos."));
  }

  @Test
  void profileRequiresBearerTokenAndReturnsCurrentUser() throws Exception {
    String token = registerAndLogin("profile@example.com", "+51900111003");

    mockMvc.perform(get("/api/profile/"))
        .andExpect(status().isUnauthorized())
        .andExpect(jsonPath("$.message").value("Autenticación requerida."))
        .andExpect(jsonPath("$.errors").isMap());

    mockMvc.perform(get("/api/profile/")
        .header(HttpHeaders.AUTHORIZATION, bearer(token)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("profile@example.com"))
        .andExpect(jsonPath("$.first_name").value("Test"));
  }

  @Test
  void refreshRotatesSpringTokensAndRefreshTokenCannotAccessProfile() throws Exception {
    register("refresh@example.com", "+51900111010");
    MvcResult loginResult = mockMvc.perform(post("/api/login/")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "refresh@example.com",
              "password": "super-secret"
            }
            """))
        .andExpect(status().isOk())
        .andReturn();
    String refreshToken = jsonValue(loginResult, "refresh_token");

    mockMvc.perform(get("/api/profile/")
        .header(HttpHeaders.AUTHORIZATION, bearer(refreshToken)))
        .andExpect(status().isUnauthorized());

    mockMvc.perform(post("/api/token/refresh/")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            { "refresh": "%s" }
            """.formatted(refreshToken)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.access_token").isString())
        .andExpect(jsonPath("$.refresh_token").isString())
        .andExpect(jsonPath("$.user.email").value("refresh@example.com"));
  }

  @Test
  void adminOnlyTokenCanReadProfile() throws Exception {
    register("admin-profile@example.com", "+51900111011");
    var user = userRepository.findByEmailIgnoreCase("admin-profile@example.com").orElseThrow();
    String adminToken = jwtService.createAccessToken(user, List.of("ADMIN"));

    mockMvc.perform(get("/api/profile/")
        .header(HttpHeaders.AUTHORIZATION, bearer(adminToken)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.email").value("admin-profile@example.com"));
  }

  @Test
  void authenticatedUserCanPartiallyUpdateProfile() throws Exception {
    String token = registerAndLogin("patch-profile@example.com", "+51900111012");

    mockMvc.perform(patch("/api/profile/")
        .header(HttpHeaders.AUTHORIZATION, bearer(token))
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "first_name": "Nombre Editado",
              "last_name": "Apellido Editado",
              "phone": "+51900111999"
            }
            """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.first_name").value("Nombre Editado"))
        .andExpect(jsonPath("$.last_name").value("Apellido Editado"))
        .andExpect(jsonPath("$.phone").value("+51900111999"))
        .andExpect(jsonPath("$.password").doesNotExist())
        .andExpect(jsonPath("$.password_hash").doesNotExist());
  }

  @Test
  void profileUpdateIgnoresInternalFieldsOutsideTheDtoAllowList() throws Exception {
    String token = registerAndLogin("allow-list-profile@example.com", "+51900111016");
    var original = userRepository.findByEmailIgnoreCase("allow-list-profile@example.com").orElseThrow();

    mockMvc.perform(patch("/api/profile/")
        .header(HttpHeaders.AUTHORIZATION, bearer(token))
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "first_name": "Nombre Seguro",
              "id": "99999999-9999-9999-9999-999999999999",
              "is_active": false,
              "created_at": "2000-01-01T00:00:00Z",
              "updated_at": "2000-01-01T00:00:00Z"
            }
            """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.id").value(original.getId().toString()))
        .andExpect(jsonPath("$.first_name").value("Nombre Seguro"));

    var updated = userRepository.findByEmailIgnoreCase("allow-list-profile@example.com").orElseThrow();
    assertEquals(original.getId(), updated.getId());
    assertEquals(original.getCreatedAt(), updated.getCreatedAt());
    assertTrue(updated.getActive());
  }

  @Test
  void profileUpdateRejectsDuplicatePhone() throws Exception {
    registerAndLogin("phone-owner@example.com", "+51900111013");
    String token = registerAndLogin("phone-conflict@example.com", "+51900111014");

    mockMvc.perform(patch("/api/profile/")
        .header(HttpHeaders.AUTHORIZATION, bearer(token))
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            { "phone": "+51900111013" }
            """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.message").value("Error de validación"))
        .andExpect(jsonPath("$.errors.phone[0]").value("El teléfono ya está registrado."));
  }

  @Test
  void profileUpdateRejectsRolesAndDoesNotChangeThem() throws Exception {
    String token = registerAndLogin("protected-profile@example.com", "+51900111015");

    mockMvc.perform(patch("/api/profile/")
        .header(HttpHeaders.AUTHORIZATION, bearer(token))
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            { "roles": ["ADMIN"] }
            """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errors.roles[0]").value("Los roles no se pueden modificar desde el perfil."));

    mockMvc.perform(get("/api/profile/")
        .header(HttpHeaders.AUTHORIZATION, bearer(token)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.roles[0]").value("CIUDADANO"));
  }

  @Test
  void profileUpdateRequiresAuthentication() throws Exception {
    mockMvc.perform(patch("/api/profile/")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            { "first_name": "Intruso" }
            """))
        .andExpect(status().isUnauthorized());
  }

  @Test
  void userCanManageOnlyOwnEmergencyContacts() throws Exception {
    String firstToken = registerAndLogin("contacts-a@example.com", "+51900111004");
    String secondToken = registerAndLogin("contacts-b@example.com", "+51900111005");

    MvcResult firstContact = mockMvc.perform(post("/api/emergency-contacts/")
        .header(HttpHeaders.AUTHORIZATION, bearer(firstToken))
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "name": "Contacto Uno",
              "phone": "+51955111000",
              "relationship": "familiar",
              "is_primary": true,
              "email": "contacto1@example.com",
              "notes": "Disponible"
            }
            """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.phone").value("+51955111000"))
        .andReturn();
    long firstContactId = Long.parseLong(jsonValue(firstContact, "id"));

    mockMvc.perform(post("/api/emergency-contacts/")
        .header(HttpHeaders.AUTHORIZATION, bearer(firstToken))
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "name": "Contacto Dos",
              "phone": "+51955111001",
              "relationship": "amigo",
              "is_primary": false
            }
            """))
        .andExpect(status().isCreated());

    mockMvc.perform(post("/api/emergency-contacts/")
        .header(HttpHeaders.AUTHORIZATION, bearer(secondToken))
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "name": "Contacto Ajeno",
              "phone": "+51955111002",
              "relationship": "vecino",
              "is_primary": false
            }
            """))
        .andExpect(status().isCreated());

    mockMvc.perform(get("/api/emergency-contacts/")
        .header(HttpHeaders.AUTHORIZATION, bearer(firstToken)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(2)))
        .andExpect(jsonPath("$[*].phone").value(not(containsString("+51955111002"))));

    mockMvc.perform(put("/api/emergency-contacts/{id}/", firstContactId)
        .header(HttpHeaders.AUTHORIZATION, bearer(firstToken))
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "name": "Contacto Uno Editado",
              "phone": "+51955111999",
              "relationship": "medico",
              "is_primary": true
            }
            """))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$.name").value("Contacto Uno Editado"))
        .andExpect(jsonPath("$.phone").value("+51955111999"));

    mockMvc.perform(put("/api/emergency-contacts/{id}/", firstContactId)
        .header(HttpHeaders.AUTHORIZATION, bearer(firstToken))
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "name": "Contacto Duplicado",
              "phone": "+51955111001",
              "relationship": "otro",
              "is_primary": false
            }
            """))
        .andExpect(status().isBadRequest())
        .andExpect(jsonPath("$.errors.phone[0]").value("El teléfono del contacto de emergencia ya está registrado."));

    mockMvc.perform(delete("/api/emergency-contacts/{id}/", firstContactId)
        .header(HttpHeaders.AUTHORIZATION, bearer(firstToken)))
        .andExpect(status().isNoContent());

    mockMvc.perform(get("/api/emergency-contacts/")
        .header(HttpHeaders.AUTHORIZATION, bearer(firstToken)))
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)));
  }

  @Test
  void sosEventIsCreatedForAuthenticatedUserAndDoesNotTrustClientNotificationCount() throws Exception {
    String token = registerAndLogin("sos@example.com", "+51900111006");

    mockMvc.perform(post("/api/sos-events/")
        .header(HttpHeaders.AUTHORIZATION, bearer(token))
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "status": "activado",
              "latitude": -12.046374,
              "longitude": -77.042793,
              "notes": "SOS activado desde test",
              "device": "integration-test",
              "notified_contacts": 99
            }
            """))
        .andExpect(status().isCreated())
        .andExpect(jsonPath("$.status").value("activado"))
        .andExpect(jsonPath("$.notified_contacts").value(0));

    mockMvc.perform(get("/api/sos-events/")
        .header(HttpHeaders.AUTHORIZATION, bearer(token)))
        .andExpect(status().isForbidden());
  }

  @Test
  void corsAllowsMutableMethodsForPublicApi() throws Exception {
    assertCorsMethodAllowed("PUT");
    assertCorsMethodAllowed("PATCH");
    assertCorsMethodAllowed("DELETE");
  }

  private void assertCorsMethodAllowed(String method) throws Exception {
    mockMvc.perform(options("/api/emergency-contacts/1/")
        .header(HttpHeaders.ORIGIN, "http://localhost:5173")
        .header(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD, method))
        .andExpect(status().isOk())
        .andExpect(header().string(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, containsString(method)));
  }

  private void register(String email, String phone) throws Exception {
    mockMvc.perform(post("/api/register/")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "first_name": "Test",
              "last_name": "User",
              "email": "%s",
              "phone": "%s",
              "password": "super-secret"
            }
            """.formatted(email, phone)))
        .andExpect(status().isOk());
  }

  private String registerAndLogin(String email, String phone) throws Exception {
    register(email, phone);
    MvcResult result = mockMvc.perform(post("/api/login/")
        .contentType(MediaType.APPLICATION_JSON)
        .content("""
            {
              "email": "%s",
              "password": "super-secret"
            }
            """.formatted(email)))
        .andExpect(status().isOk())
        .andReturn();
    return jsonValue(result, "access_token");
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
}
