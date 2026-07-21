package com.laxmannath.job_scraper_backend.controllers;

import com.laxmannath.job_scraper_backend.dtos.PagedResponse;
import com.laxmannath.job_scraper_backend.models.Source;
import com.laxmannath.job_scraper_backend.pagination.Pagination;
import com.laxmannath.job_scraper_backend.services.SourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/sources")
@RequiredArgsConstructor
public class PublicSourceController {

    private final SourceService sourceService;

    @GetMapping
    public PagedResponse<Source> listSources(@ModelAttribute Pagination pagination, @RequestParam(required = false) String q) {
        return sourceService.listSourcesPaginated(pagination,q);
    }
}
