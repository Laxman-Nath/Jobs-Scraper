package com.laxmannath.job_scraper_backend.services;


import com.laxmannath.job_scraper_backend.dtos.PagedResponse;
import com.laxmannath.job_scraper_backend.exceptions.ResourceNotFoundException;
import com.laxmannath.job_scraper_backend.models.Source;
import com.laxmannath.job_scraper_backend.pagination.Pagination;
import com.laxmannath.job_scraper_backend.pagination.PaginationDefaults;
import com.laxmannath.job_scraper_backend.pagination.PaginationUtil;
import com.laxmannath.job_scraper_backend.repository.SourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SourceService {

    private final SourceRepository sourceRepository;
    private final PaginationDefaults paginationDefaults;

    @Caching(evict = {
            @CacheEvict(value = "sourcesList",allEntries = true)
    })

    public Source createSource(Source source) {
        source.setEnabled(true);
        source.setStatus("active");
        return sourceRepository.save(source);
    }

    public List<Source> getAllSources() {
        return sourceRepository.findAll();
    }

    @Cacheable(value = "sources", key = "#id")
    public Source getSourceById(Long id) {
        return sourceRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Source not found: " + id));
    }

    @Caching(evict = {
            @CacheEvict(value = "sources", key = "#id"),
            @CacheEvict(value = "sourcesList", allEntries = true)
    })
    public Source updateSource(Long id, Source updatedFields) {
        Source existing = getSourceById(id);

        if (updatedFields.getCompanyName() != null) existing.setCompanyName(updatedFields.getCompanyName());
        if (updatedFields.getUrl() != null) existing.setUrl(updatedFields.getUrl());
        if (updatedFields.getSourceType() != null) existing.setSourceType(updatedFields.getSourceType());
        if (updatedFields.getEnabled() != null) existing.setEnabled(updatedFields.getEnabled());

        return sourceRepository.save(existing);
    }

    @Caching(evict = {
            @CacheEvict(value = "sources", key = "#id"),
            @CacheEvict(value = "sourcesList", allEntries = true)
    })

    public void deleteSource(Long id) {
        if (!sourceRepository.existsById(id)) {
            throw new ResourceNotFoundException("Source not found with id: " + id);
        }
        sourceRepository.deleteById(id);
    }

    public List<Source> getEnabledSources() {
        return sourceRepository.findAll().stream()
                .filter(Source::getEnabled)
                .toList();
    }

    public Long getTotalNoOfSources(){
        return sourceRepository.count();
    }

    @Cacheable(value = "sourcesList", key = "#pagination.pageNo + '-' + #pagination.pageSize + '-' + (#pagination.sortParameter ?: 'createdAt') + '-' + (# pagination.sortingOrder ?: 'descending')")
    public PagedResponse<Source> listSourcesPaginated(Pagination pagination,String searchQuery) {
        pagination = paginationDefaults.applyDefaults(pagination);
        Pageable pageable = PaginationUtil.performPagination(pagination);

        Page<Source> result;
        if (StringUtils.hasText(searchQuery)) {
            result = sourceRepository.searchSources(searchQuery.trim(), pageable);
        } else {
            result = sourceRepository.findAll(pageable);
        }

        return new PagedResponse<>(result);
    }
}
