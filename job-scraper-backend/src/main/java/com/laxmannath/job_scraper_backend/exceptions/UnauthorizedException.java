package com.laxmannath.job_scraper_backend.exceptions;


public class UnauthorizedException extends RuntimeException {
    public UnauthorizedException(String message) {
        super(message);
    }
}
