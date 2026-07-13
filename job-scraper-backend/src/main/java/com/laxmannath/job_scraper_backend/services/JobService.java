package com.laxmannath.job_scraper_backend.services;


import com.laxmannath.job_scraper_backend.dtos.JobDto;
import com.laxmannath.job_scraper_backend.models.Job;
import com.laxmannath.job_scraper_backend.models.Source;
import com.laxmannath.job_scraper_backend.repository.JobRepository;
import com.laxmannath.job_scraper_backend.repository.SourceRepository;
import com.laxmannath.job_scraper_backend.services.fetcher.JobFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class JobService {

    private final List<JobFetcher> fetchers; // Spring injects ALL JobFetcher beans automatically
    private final SourceRepository sourceRepository;
    private final JobPersistenceService jobPersistenceService;


    public List<JobDto> fetchFromSource(String sourceType, String url, String companyName) throws Exception {
        JobFetcher fetcher = fetchers.stream()
                .filter(f -> f.supports(sourceType))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("No fetcher found for type: " + sourceType));

        return fetcher.fetchJobs(url, companyName);
    }
    public List<JobDto> crawlSource(Long sourceId) {
        try {
            Source source = sourceRepository.findById(sourceId)
                    .orElseThrow(() -> new IllegalArgumentException("Source not found: " + sourceId));

            JobFetcher fetcher = fetchers.stream()
                    .filter(f -> f.supports(source.getSourceType()))
                    .findFirst()
                    .orElseThrow(() -> new IllegalArgumentException("No fetcher for type: " + source.getSourceType()));

            List<JobDto> jobs = fetcher.fetchJobs(source.getUrl(), source.getCompanyName());
            jobPersistenceService.saveJobs(jobs);
            source.setStatus("active");
            source.setJobsFoundLastRun(jobs.size());
            source.setLastCrawledAt(java.time.LocalDateTime.now());
            source.setLastError(null);
            sourceRepository.save(source);
            return jobs;

        } catch (Exception e) {
            System.err.println("Crawl failed for source " + sourceId + ": " + e.getMessage());
            return List.of();
        }
    }

    public void crawlAllEnabledSources() {
        List<Source> sources = sourceRepository.findAll().stream()
                .filter(Source::getEnabled)
                .toList();

        for (Source source : sources) {
            crawlSource(source.getId());
        }
    }

//    public List<JobDto> getAllJobs(){
//        List<Job>=JobRepository.findAll();
//    }

}
