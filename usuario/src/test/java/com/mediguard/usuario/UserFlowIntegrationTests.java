package com.mediguard.usuario;

import com.mediguard.usuario.user.repository.EmergencyContactRepository;
import com.mediguard.usuario.user.repository.SosEventRepository;
import com.mediguard.usuario.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;

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

  @BeforeEach
  void cleanDatabase() {
    sosEventRepository.deleteAll();
    emergencyContactRepository.deleteAll();
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
        .andExpect(jsonPath("$.accessToken").isString())
        .andExpect(jsonPath("$.refreshToken").isString())
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
        .andExpect(jsonPath("$.accessToken").isString())
        .andExpect(jsonPath("$.user.email").value("browser-register@example.com"));
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
        .andExpect(status().isOk())
        .andExpect(jsonPath("$", hasSize(1)))
        .andExpect(jsonPath("$[0].device").value("integration-test"));
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
    return jsonValue(result, "accessToken");
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
