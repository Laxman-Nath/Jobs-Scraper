package com.laxmannath.job_scraper_backend.services;



import com.laxmannath.job_scraper_backend.dtos.JobDto;
import com.laxmannath.job_scraper_backend.models.Job;
import com.laxmannath.job_scraper_backend.repository.JobRepository;
import com.laxmannath.job_scraper_backend.utils.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobPersistenceService {

    private final JobRepository jobRepository;

    public void saveJobs(List<JobDto> jobDtos) {
        for (JobDto dto : jobDtos) {
            String externalId = IdGenerator.generateExternalId(dto.getCompany(), dto.getTitle());

            Job job = jobRepository.findBySourceAndExternalId(dto.getSource(), externalId)
                    .orElseGet(() -> {
                        Job newJob = new Job();
                        newJob.setSource(dto.getSource());
                        newJob.setExternalId(externalId);
                        newJob.setFirstSeenAt(LocalDateTime.now());
                        return newJob;
                    });

            job.setTitle(dto.getTitle());
            job.setCompany(dto.getCompany());
            job.setLocation(dto.getLocation());
            job.setUrl(dto.getUrl());
            job.setDescription(dto.getDescription());
            job.setPostedAt(dto.getPostedAt());
            job.setLastSeenAt(LocalDateTime.now());
            job.setStatus("active");

            jobRepository.save(job);
        }
    }
}

