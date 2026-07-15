package com.laxmannath.job_scraper_backend.dtos;


import lombok.Data;

@Data
public class LoginRequest {
    private String email;
    private String password;
}
