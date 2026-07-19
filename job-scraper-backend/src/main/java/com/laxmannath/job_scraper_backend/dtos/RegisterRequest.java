package com.laxmannath.job_scraper_backend.dtos;



import lombok.Data;
import java.util.List;

@Data
public class RegisterRequest {
    private String email;
    private String password;
    private List<String> preferredTitles;
    private List<String> skills;
    private List<String> preferredLocations;
}