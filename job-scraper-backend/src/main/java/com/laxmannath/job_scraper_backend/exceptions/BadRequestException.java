package com.laxmannath.job_scraper_backend.exceptions;


public class BadRequestException extends RuntimeException {
    public BadRequestException(String message) {
        super(message);
    }
}