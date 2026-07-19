package com.laxmannath.job_scraper_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
public class ErrorResponse {
    private int status;
    private String error;
    private String message;
    private String path;
    private LocalDateTime timestamp;
    private List<ValidationError> fieldErrors;

    @Data
    @AllArgsConstructor
    public static class ValidationError {
        private String field;
        private String message;
    }
}