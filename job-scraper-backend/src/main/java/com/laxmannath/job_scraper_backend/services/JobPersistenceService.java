package com.laxmannath.job_scraper_backend.services;



import com.laxmannath.job_scraper_backend.dtos.JobDto;
import com.laxmannath.job_scraper_backend.models.Job;
import com.laxmannath.job_scraper_backend.models.User;
import com.laxmannath.job_scraper_backend.repository.JobRepository;
import com.laxmannath.job_scraper_backend.repository.UserRepository;
import com.laxmannath.job_scraper_backend.utils.IdGenerator;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class JobPersistenceService {

    private final JobRepository jobRepository;
    private final UserRepository userRepository;
    private final RecommendationService recommendationService;
    private final EmailPublisher emailPublisher;
    @org.springframework.beans.factory.annotation.Value("${app.frontend-url}")
    private String frontendUrl;
    @CacheEvict(value = "jobsList", allEntries = true)
    public void saveJobs(List<JobDto> jobDtos) {
        for (JobDto dto : jobDtos) {
            String externalId = IdGenerator.generateExternalId(dto.getCompany(), dto.getTitle());

            boolean isNewJob = jobRepository.findBySourceAndExternalId(dto.getSource(), externalId).isEmpty();

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

            Job saved = jobRepository.save(job);
System.out.println("Is new job +"+isNewJob);
            if (isNewJob) {
                notifyMatchingUsers(saved);
            }
        }
    }

    private void notifyMatchingUsers(Job job) {
        List<User> users = userRepository.findAll().stream()
                .filter(u -> Boolean.TRUE.equals(u.getEmailVerified()))
                .filter(u -> Boolean.TRUE.equals(u.getEmailNotificationsEnabled()))
                .filter(u -> u.getMutedCompanies() == null || !u.getMutedCompanies().contains(job.getCompany()))
                .toList();

        for (User user : users) {
            if (Boolean.TRUE.equals(user.getProfileComplete()) && recommendationService.jobMatchesUser(job, user)) {
                emailPublisher.publishEmail(
                        user.getEmail(),
                        "New job match: " + job.getTitle(),
                        "A new job matching your profile was just found:\n\n" +
                                job.getTitle() + " at " + job.getCompany() +
                                (job.getLocation() != null ? " · " + job.getLocation() : "") +
                                "\n\nView it here: " + frontendUrl + "/jobs/" + job.getId()
                );
            }
        }
    }
}