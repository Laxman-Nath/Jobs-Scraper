package com.laxmannath.job_scraper_backend.services;



import com.laxmannath.job_scraper_backend.models.Job;
import com.laxmannath.job_scraper_backend.models.User;
import com.laxmannath.job_scraper_backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class RecommendationService {

    private final JobRepository jobRepository;

    public List<Job> getRecommendationsForUser(User user) {
        List<Job> activeJobs = jobRepository.findAllByStatus("active");

        List<String> keywords = buildKeywordList(user);
        if (keywords.isEmpty()) return List.of();

        return activeJobs.stream()
                .filter(job -> matchesKeywords(job, keywords))
                .limit(20)
                .collect(Collectors.toList());
    }

    public boolean jobMatchesUser(Job job, User user) {
        List<String> keywords = buildKeywordList(user);
        return matchesKeywords(job, keywords);
    }

    private List<String> buildKeywordList(User user) {
        List<String> keywords = new ArrayList<>();
        if (user.getPreferredTitles() != null) keywords.addAll(user.getPreferredTitles());
        if (user.getSkills() != null) keywords.addAll(user.getSkills());
        return keywords.stream().map(String::toLowerCase).collect(Collectors.toList());
    }

    private boolean matchesKeywords(Job job, List<String> keywords) {
        String searchableText = (job.getTitle() + " " + safe(job.getDescription())).toLowerCase();
        return keywords.stream().anyMatch(searchableText::contains);
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}
