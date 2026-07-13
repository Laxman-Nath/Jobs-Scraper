package com.laxmannath.job_scraper_backend.services;


import com.laxmannath.job_scraper_backend.dtos.JobDto;
import com.laxmannath.job_scraper_backend.services.fetcher.JobFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final List<JobFetcher> fetchers; // Spring injects ALL JobFetcher beans automatically



    public List<JobDto> fetchFromSource(String sourceType, String url, String companyName) throws Exception {
        JobFetcher fetcher = fetchers.stream()
                .filter(f -> f.supports(sourceType))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No fetcher found for type: " + sourceType));

        return fetcher.fetchJobs(url, companyName);
    }
}
