package com.laxmannath.job_scraper_backend.controllers;

import com.laxmannath.job_scraper_backend.dtos.JobDto;
import com.laxmannath.job_scraper_backend.dtos.PagedResponse;
import com.laxmannath.job_scraper_backend.models.Job;
import com.laxmannath.job_scraper_backend.pagination.Pagination;
import com.laxmannath.job_scraper_backend.services.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
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
    public PagedResponse<Job> getAllJobs(@ModelAttribute  Pagination pagination){
        return jobService.listJobsPaginated(pagination);
    }





}
