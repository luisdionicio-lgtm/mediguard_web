package com.mediguard.usuario.user.security;

import jakarta.servlet.http.HttpServletRequest;
import java.nio.charset.StandardCharsets;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.RequestMatcher;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;

    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
    }

    @Bean
    @Order(1)
    SecurityFilterChain publicApiSecurityFilterChain(HttpSecurity http) throws Exception {
        return http
                .securityMatcher(this::isPublicRequest)
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/**")
                        .disable())
                .cors(cors -> {})
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                .httpBasic(AbstractHttpConfigurer::disable)
                .build();
    }

    @Bean
    @Order(2)
    SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .securityMatcher("/api/**")
                .csrf(csrf -> csrf
                        .ignoringRequestMatchers("/api/**")
                        .disable())
                .cors(cors -> {})
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .exceptionHandling(exceptions -> exceptions
                        .authenticationEntryPoint((request, response, authException) ->
                                writeJsonError(response, HttpStatus.UNAUTHORIZED, "Autenticación requerida."))
                        .accessDeniedHandler((request, response, accessDeniedException) ->
                                writeJsonError(response, HttpStatus.FORBIDDEN, "Acceso denegado.")))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers(
                                publicMatcher(HttpMethod.OPTIONS, "/api/**"),
                                publicMatcher(HttpMethod.POST, "/api/login/"),
                                publicMatcher(HttpMethod.POST, "/api/login/**"),
                                publicMatcher(HttpMethod.POST, "/api/register/"),
                                publicMatcher(HttpMethod.POST, "/api/register/**"),
                                publicMatcher(HttpMethod.POST, "/api/token/refresh/"),
                                publicMatcher(HttpMethod.POST, "/api/token/refresh/**"),
                                publicMatcher(HttpMethod.POST, "/api/usuarios/**"),
                                publicMatcher(HttpMethod.POST, "/api/forgot-password/"),
                                publicMatcher(HttpMethod.POST, "/api/forgot-password/**"),
                                publicMatcher(HttpMethod.POST, "/api/reset-password/"),
                                publicMatcher(HttpMethod.POST, "/api/reset-password/**"),
                                publicMatcher(HttpMethod.GET, "/api/guides/**"),
                                publicMatcher(HttpMethod.GET, "/api/hospitals/**"),
                                publicMatcher(HttpMethod.GET, "/api/news/**"),
                                publicMatcher(HttpMethod.GET, "/api/emergencies/"),
                                publicMatcher(HttpMethod.GET, "/api/emergencies/**"),
                                publicMatcher(HttpMethod.GET, "/api/emergency-numbers/"),
                                publicMatcher(HttpMethod.GET, "/api/emergency-numbers/**")
                        ).permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/profile/**").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/logout/**").authenticated()
                        .anyRequest().authenticated()
                )
                .httpBasic(AbstractHttpConfigurer::disable)
                .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    private boolean isPublicRequest(HttpServletRequest request) {
        return publicMatcher(HttpMethod.OPTIONS, "/api/**").matches(request)
                || publicMatcher(HttpMethod.POST, "/api/login/").matches(request)
                || publicMatcher(HttpMethod.POST, "/api/login/**").matches(request)
                || publicMatcher(HttpMethod.POST, "/api/register/").matches(request)
                || publicMatcher(HttpMethod.POST, "/api/register/**").matches(request)
                || publicMatcher(HttpMethod.POST, "/api/token/refresh/").matches(request)
                || publicMatcher(HttpMethod.POST, "/api/token/refresh/**").matches(request)
                || publicMatcher(HttpMethod.POST, "/api/usuarios/**").matches(request)
                || publicMatcher(HttpMethod.POST, "/api/forgot-password/").matches(request)
                || publicMatcher(HttpMethod.POST, "/api/forgot-password/**").matches(request)
                || publicMatcher(HttpMethod.POST, "/api/reset-password/").matches(request)
                || publicMatcher(HttpMethod.POST, "/api/reset-password/**").matches(request)
                || publicMatcher(HttpMethod.GET, "/api/guides/**").matches(request)
                || publicMatcher(HttpMethod.GET, "/api/hospitals/**").matches(request)
                || publicMatcher(HttpMethod.GET, "/api/news/**").matches(request)
                || publicMatcher(HttpMethod.GET, "/api/emergencies/").matches(request)
                || publicMatcher(HttpMethod.GET, "/api/emergencies/**").matches(request)
                || publicMatcher(HttpMethod.GET, "/api/emergency-numbers/").matches(request)
                || publicMatcher(HttpMethod.GET, "/api/emergency-numbers/**").matches(request);
    }

    private RequestMatcher publicMatcher(HttpMethod method, String pattern) {
        return request -> {
            if (!method.name().equals(request.getMethod())) {
                return false;
            }

            String path = request.getRequestURI();
            String contextPath = request.getContextPath();
            if (contextPath != null && !contextPath.isBlank() && path.startsWith(contextPath)) {
                path = path.substring(contextPath.length());
            }

            if (pattern.endsWith("/**")) {
                String prefix = pattern.substring(0, pattern.length() - 3);
                return path.equals(prefix) || path.equals(prefix + "/") || path.startsWith(prefix + "/");
            }
            return path.equals(pattern);
        };
    }

    private void writeJsonError(jakarta.servlet.http.HttpServletResponse response, HttpStatus status, String message)
            throws java.io.IOException {
        response.setStatus(status.value());
        response.setCharacterEncoding(StandardCharsets.UTF_8.name());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write("{\"message\":\"" + message + "\",\"errors\":{}}");
    }

    @Bean
    PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
