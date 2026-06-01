package com.mediguard.usuario.user.exception;

import com.mediguard.usuario.user.dto.ErrorResponse;
import jakarta.validation.ConstraintViolationException;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(ApiFieldException.class)
    public ResponseEntity<ErrorResponse> handleApiFieldException(ApiFieldException ex) {
        return ResponseEntity
                .status(ex.getStatus())
                .body(new ErrorResponse(ex.getMessage(), ex.getErrors()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, List<String>> errors = new LinkedHashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(fieldError ->
                addError(errors, fieldError.getField(), fieldError.getDefaultMessage()));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Error de validación", errors));
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<ErrorResponse> handleConstraintViolationException(ConstraintViolationException ex) {
        Map<String, List<String>> errors = new LinkedHashMap<>();
        ex.getConstraintViolations().forEach(violation ->
                addError(errors, violation.getPropertyPath().toString(), violation.getMessage()));

        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse("Error de validación", errors));
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ErrorResponse> handleResponseStatusException(ResponseStatusException ex) {
        HttpStatus status = HttpStatus.valueOf(ex.getStatusCode().value());
        String message = ex.getReason() == null ? status.getReasonPhrase() : ex.getReason();

        return ResponseEntity
                .status(status)
                .body(new ErrorResponse(message, Map.of()));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(new ErrorResponse(
                        "Error de validación",
                        dataIntegrityErrors(ex)));
    }

    private void addError(Map<String, List<String>> errors, String field, String message) {
        errors.computeIfAbsent(field, ignored -> new ArrayList<>())
                .add(message == null ? "Valor inválido." : message);
    }

    private Map<String, List<String>> dataIntegrityErrors(DataIntegrityViolationException ex) {
        String message = exceptionMessage(ex);
        Map<String, List<String>> errors = new LinkedHashMap<>();

        if (isEmailFormatViolation(message)) {
            addError(errors, "email", "El formato del correo no es válido.");
        } else if (isEmailDuplicateViolation(message)) {
            addError(errors, "email", "El correo ya está registrado.");
        } else if (isPhoneDuplicateViolation(message)) {
            addError(errors, "phone", "El teléfono ya está registrado.");
        }

        if (errors.isEmpty()) {
            addError(errors, "request", "Los datos enviados entran en conflicto con registros existentes.");
        }
        return errors;
    }

    private boolean isEmailDuplicateViolation(String message) {
        return message.contains("users_email_key")
                || message.contains("key (email)")
                || message.contains("unique index") && message.contains("users") && message.contains("email")
                || message.contains("duplicate key") && message.contains("email");
    }

    private boolean isPhoneDuplicateViolation(String message) {
        return message.contains("users_phone_key")
                || message.contains("key (phone)")
                || message.contains("unique index") && message.contains("users") && message.contains("phone")
                || message.contains("duplicate key") && message.contains("phone");
    }

    private boolean isEmailFormatViolation(String message) {
        return message.contains("chk_email_format")
                || message.contains("check constraint") && message.contains("email");
    }

    private String exceptionMessage(Throwable throwable) {
        StringBuilder message = new StringBuilder();
        Throwable current = throwable;
        while (current != null) {
            if (current.getMessage() != null) {
                message.append(current.getMessage()).append('\n');
            }
            current = current.getCause();
        }
        return message.toString().toLowerCase(Locale.ROOT);
    }
}
