package com.laxmannath.job_scraper_backend.controllers;

import com.laxmannath.job_scraper_backend.services.AdminStatsService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/admin/stats")
@RequiredArgsConstructor
public class AdminStatsController {
    private final AdminStatsService adminStatsService;
    @GetMapping
    public Map<String, Object> getStats() {
       return adminStatsService.getStats();
    }

}
