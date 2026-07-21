package com.laxmannath.job_scraper_backend.dtos;

public record ResetPasswordRequest(String email, String code, String newPassword) {}
