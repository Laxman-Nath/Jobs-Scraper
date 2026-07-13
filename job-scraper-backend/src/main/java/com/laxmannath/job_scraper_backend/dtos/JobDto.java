package com.laxmannath.job_scraper_backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class JobDto {
    private String title;
    private String company;
    private String location;
    private String url;
    private String description;
    private String postedAt;
    private String source;

}