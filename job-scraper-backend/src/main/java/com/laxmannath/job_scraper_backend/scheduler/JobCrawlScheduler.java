package com.laxmannath.job_scraper_backend.scheduler;


import com.laxmannath.job_scraper_backend.services.JobService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class JobCrawlScheduler {

    private final JobService jobService;

    @Scheduled(fixedRate = 1800000) // every 30 minutes
    public void runScheduledCrawl() {
        System.out.println("Starting scheduled crawl at " + java.time.LocalDateTime.now());
        jobService.crawlAllEnabledSources();
        System.out.println("Scheduled crawl finished");
    }
}
