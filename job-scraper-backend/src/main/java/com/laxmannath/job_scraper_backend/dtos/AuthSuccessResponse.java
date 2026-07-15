package com.laxmannath.job_scraper_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthSuccessResponse {
    private String token;
    private String refreshToken;
    private String email;
    private String role;
}
