package com.laxmannath.job_scraper_backend.dtos;

import lombok.Data;

@Data
public class RefreshRequest {
    private String refreshToken;
}
