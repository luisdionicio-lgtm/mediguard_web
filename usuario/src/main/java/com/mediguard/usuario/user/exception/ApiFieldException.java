package com.mediguard.usuario.user.exception;

import java.util.List;
import java.util.Map;
import org.springframework.http.HttpStatus;

public class ApiFieldException extends RuntimeException {

    private final HttpStatus status;
    private final Map<String, List<String>> errors;

    public ApiFieldException(HttpStatus status, String message, Map<String, List<String>> errors) {
        super(message);
        this.status = status;
        this.errors = errors;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public Map<String, List<String>> getErrors() {
        return errors;
    }
}
