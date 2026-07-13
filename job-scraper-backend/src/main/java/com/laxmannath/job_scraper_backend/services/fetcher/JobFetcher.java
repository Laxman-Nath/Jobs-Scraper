package com.laxmannath.job_scraper_backend.services.fetcher;

import com.laxmannath.job_scraper_backend.dtos.JobDto;

import java.util.List;

public interface JobFetcher {
    List<JobDto> fetchJobs(String url, String companyName) throws Exception;
    boolean supports(String sourceType);
}
