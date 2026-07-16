package com.laxmannath.job_scraper_backend.controllers;


import com.laxmannath.job_scraper_backend.dtos.PagedResponse;
import com.laxmannath.job_scraper_backend.models.Source;
import com.laxmannath.job_scraper_backend.pagination.Pagination;
import com.laxmannath.job_scraper_backend.services.SourceService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/admin/sources")
@RequiredArgsConstructor
public class SourceController {

    private final SourceService sourceService;

    @PostMapping
    public Source addSource(@RequestBody Source source) {
        return sourceService.createSource(source);
    }

    @GetMapping
    public PagedResponse<Source> listSources(@ModelAttribute Pagination pagination,@RequestParam(required = false) String q) {
        return sourceService.listSourcesPaginated(pagination,q);
    }

    @GetMapping("/{id}")
    public Source getSource(@PathVariable Long id) {
        return sourceService.getSourceById(id);
    }

    @PatchMapping("/{id}")
    public Source updateSource(@PathVariable Long id, @RequestBody Source updatedFields) {
        return sourceService.updateSource(id, updatedFields);
    }

    @DeleteMapping("/{id}")
    public void deleteSource(@PathVariable Long id) {
        sourceService.deleteSource(id);
    }
}
