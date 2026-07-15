package com.laxmannath.job_scraper_backend.dtos;



import lombok.Data;

@Data
public class RegisterRequest {
    private String email;
    private String password;
}
