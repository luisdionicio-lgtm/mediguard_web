package com.mediguard.usuario.user.exception;

import com.mediguard.usuario.user.dto.ErrorResponse;
import org.junit.jupiter.api.Test;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class ApiExceptionHandlerTest {

    private final ApiExceptionHandler handler = new ApiExceptionHandler();

    @Test
    void dataIntegrityViolationMapsEmailDuplicateToFieldError() {
        ResponseEntity<ErrorResponse> response = handle("""
                ERROR: duplicate key value violates unique constraint "users_email_key"
                Detail: Key (email)=(test@example.com) already exists.
                """);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals("Error de validación", response.getBody().message());
        assertEquals(
                "El correo ya está registrado.",
                response.getBody().errors().get("email").getFirst());
    }

    @Test
    void dataIntegrityViolationMapsPhoneDuplicateToFieldError() {
        ResponseEntity<ErrorResponse> response = handle("""
                ERROR: duplicate key value violates unique constraint "users_phone_key"
                Detail: Key (phone)=(+51999999999) already exists.
                """);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(
                "El teléfono ya está registrado.",
                response.getBody().errors().get("phone").getFirst());
    }

    @Test
    void dataIntegrityViolationMapsEmailCheckConstraintToFieldError() {
        ResponseEntity<ErrorResponse> response = handle("""
                ERROR: new row for relation "users" violates check constraint "chk_email_format"
                """);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(
                "El formato del correo no es válido.",
                response.getBody().errors().get("email").getFirst());
    }

    @Test
    void dataIntegrityViolationKeepsFallbackForUnknownConstraint() {
        ResponseEntity<ErrorResponse> response = handle("""
                ERROR: insert or update on table "users" violates foreign key constraint "unknown_fk"
                """);

        assertEquals(HttpStatus.BAD_REQUEST, response.getStatusCode());
        assertNotNull(response.getBody());
        assertEquals(
                "Los datos enviados entran en conflicto con registros existentes.",
                response.getBody().errors().get("request").getFirst());
    }

    private ResponseEntity<ErrorResponse> handle(String databaseMessage) {
        return handler.handleDataIntegrityViolationException(
                new DataIntegrityViolationException("could not execute statement", new RuntimeException(databaseMessage)));
    }
}
