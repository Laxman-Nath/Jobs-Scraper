package com.laxmannath.job_scraper_backend.controllers;

import com.laxmannath.job_scraper_backend.dtos.JobDto;
import com.laxmannath.job_scraper_backend.dtos.PagedResponse;
import com.laxmannath.job_scraper_backend.models.Job;
import com.laxmannath.job_scraper_backend.pagination.Pagination;
import com.laxmannath.job_scraper_backend.services.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
public class JobsController {


    private final JobService jobService;


    @GetMapping("/fetch")
    public List<JobDto> fetch(
            @RequestParam String sourceType,
            @RequestParam String url,
            @RequestParam String company) throws Exception {
        System.out.println("Url from client :"+url);

        return jobService.fetchFromSource(sourceType, url, company);
    }
    @GetMapping("/crawl")
    public void crawlJobs(){
       jobService. crawlAllEnabledSources();
    }
    @GetMapping
    public PagedResponse<Job> getAllOrSearchJobs(@ModelAttribute  Pagination pagination,@RequestParam(required = false) String q){
        return jobService.listJobsPaginated(pagination,q);
    }

    // will be used by admin only
    @GetMapping("/crawl/{sourceId}")
    public void crawlSource(@PathVariable Long sourceId) throws Exception {
        jobService.crawlSource(sourceId);
    }

    @GetMapping("/{jobId}")
    public Job getJobById(@PathVariable Long jobId){
     return jobService.getJobById(jobId);
    }

    @GetMapping("/by-source/{sourceId}")
    public PagedResponse<Job> getJobsBySource(
            @PathVariable Long sourceId,
            @ModelAttribute Pagination pagination) {
        return jobService.getJobsByCompany(sourceId,pagination);
    }







}
