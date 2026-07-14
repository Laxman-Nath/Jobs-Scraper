package com.laxmannath.job_scraper_backend.services;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Map;
@Service
@RequiredArgsConstructor
public class AdminStatsService {
    private final SourceService sourceService;
    private final JobService jobService;
    public Map<String, Object> getStats() {
        long totalJobs = jobService.getTotalNoOfJobs();
        long totalSources = sourceService.getTotalNoOfSources();
        long activeSources = sourceService.getAllSources().stream()
                .filter(s -> "active".equals(s.getStatus())).count();
        long failingSources = sourceService.getAllSources().stream()
                .filter(s -> "failing".equals(s.getStatus())).count();

        return Map.of(
                "totalJobs", totalJobs,
                "totalSources", totalSources,
                "activeSources", activeSources,
                "failingSources", failingSources
        );
    }
}
