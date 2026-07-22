package com.laxmannath.job_scraper_backend.services;


import com.laxmannath.job_scraper_backend.dtos.JobDto;
import com.laxmannath.job_scraper_backend.dtos.PagedResponse;
import com.laxmannath.job_scraper_backend.exceptions.BadRequestException;
import com.laxmannath.job_scraper_backend.exceptions.ResourceNotFoundException;
import com.laxmannath.job_scraper_backend.pagination.Pagination;
import com.laxmannath.job_scraper_backend.pagination.PaginationDefaults;
import com.laxmannath.job_scraper_backend.models.Job;
import com.laxmannath.job_scraper_backend.models.Source;

import com.laxmannath.job_scraper_backend.pagination.PaginationUtil;
import com.laxmannath.job_scraper_backend.repository.JobRepository;
import com.laxmannath.job_scraper_backend.services.fetcher.JobFetcher;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;
import lombok.extern.slf4j.Slf4j;
@Service
@RequiredArgsConstructor
@Slf4j
public class JobService {

    private final List<JobFetcher> fetchers; // Spring injects ALL JobFetcher beans automatically
    private final SourceService sourceService;
    private final JobPersistenceService jobPersistenceService;
    private final JobRepository jobRepository;
    private final PaginationDefaults paginationDefaults;


    public List<JobDto> fetchFromSource(String sourceType, String url, String companyName) throws Exception {
        JobFetcher fetcher = fetchers.stream()
                .filter(f -> f.supports(sourceType))
                .findFirst()
                .orElseThrow(() -> new BadRequestException("No fetcher found for type: " + sourceType));

        return fetcher.fetchJobs(url, companyName);
    }
    public List<JobDto> crawlSource(Long sourceId) throws  Exception {
        Source source = sourceService.getSourceById(sourceId);

        try {

            JobFetcher fetcher = fetchers.stream()
                    .filter(f -> f.supports(source.getSourceType()))
                    .findFirst()
                    .orElseThrow(() -> new BadRequestException("No fetcher for type: " + source.getSourceType()));

            List<JobDto> jobs = fetcher.fetchJobs(source.getUrl(), source.getCompanyName());
            jobPersistenceService.saveJobs(jobs);
            source.setStatus("active");
            source.setJobsFoundLastRun(jobs.size());
            source.setLastCrawledAt(java.time.LocalDateTime.now());
            source.setLastError(null);
            sourceService.createSource(source);
            return jobs;

        } catch (Exception e) {
            System.err.println("Crawl failed for source " + sourceId + ": " + e);
            source.setStatus("failing");
            source.setLastError(e.getMessage());
            source.setLastCrawledAt(java.time.LocalDateTime.now());
            throw e;

        }
    }

    public void crawlAllEnabledSources() {
        List<Source> sources = sourceService.getEnabledSources();
        for (Source source : sources) {
            try {
                crawlSource(source.getId());
            } catch (Exception e) {
                // for the CRON path specifically, don't let one failing source crash the whole batch
                System.err.println("Crawl failed for source " + source.getId() + ": " + e.getMessage());
            }
        }
    }



    public List<Job> getAllJobs(){
        return jobRepository.findAll();
    }

    public Job getJobById(Long jobId){
        return jobRepository.findById(jobId).orElseThrow(()-> new ResourceNotFoundException("Job not found with id "+jobId));
    }

    @Cacheable(
            value = "jobsList",
            key = "#pagination.pageNo + '-' + #pagination.pageSize + '-' + (#pagination.sortParameter ?: 'createdAt') + '-' + (#q ?: 'none')"
    )
    public PagedResponse<Job> listJobsPaginated(Pagination pagination,String searchQuery) {
        log.info("CACHE MISS — querying DB for jobsList [q={}, page={}, size={}]", searchQuery, pagination.getPageNo(), pagination.getPageSize());
        pagination = paginationDefaults.applyDefaults(pagination);
        Pageable pageable = PaginationUtil.performPagination(pagination);

        Page<Job> result;
        if (StringUtils.hasText(searchQuery)) {
            result = jobRepository.searchJobs(searchQuery.trim(), pageable);
        } else {
            result = jobRepository.findByStatus("active", pageable);
        }

        return new PagedResponse<>(result);
    }

    public Long getTotalNoOfJobs(){
        return jobRepository.count();
    }

    public PagedResponse<Job> getJobsByCompany(Long sourceId,Pagination pagination){
        Source source = sourceService.getSourceById(sourceId); // throws ResourceNotFoundException if missing

        pagination = paginationDefaults.applyDefaults(pagination);
        Pageable pageable = PaginationUtil.performPagination(pagination);

        Page<Job> result = jobRepository.findByCompanyIgnoreCaseAndStatus(source.getCompanyName(), "active", pageable);
        return new PagedResponse<>(result);

    }

}
