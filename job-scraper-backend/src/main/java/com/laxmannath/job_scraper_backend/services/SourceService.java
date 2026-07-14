package com.laxmannath.job_scraper_backend.services;


import com.laxmannath.job_scraper_backend.models.Source;
import com.laxmannath.job_scraper_backend.repository.SourceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SourceService {

    private final SourceRepository sourceRepository;

    public Source createSource(Source source) {
        source.setEnabled(true);
        source.setStatus("active");
        return sourceRepository.save(source);
    }

    public List<Source> getAllSources() {
        return sourceRepository.findAll();
    }

    public Source getSourceById(Long id) {
        return sourceRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Source not found: " + id));
    }

    public Source updateSource(Long id, Source updatedFields) {
        Source existing = getSourceById(id);

        if (updatedFields.getCompanyName() != null) existing.setCompanyName(updatedFields.getCompanyName());
        if (updatedFields.getUrl() != null) existing.setUrl(updatedFields.getUrl());
        if (updatedFields.getSourceType() != null) existing.setSourceType(updatedFields.getSourceType());
        if (updatedFields.getEnabled() != null) existing.setEnabled(updatedFields.getEnabled());

        return sourceRepository.save(existing);
    }

    public void deleteSource(Long id) {
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
}
