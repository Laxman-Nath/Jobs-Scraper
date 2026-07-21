package com.laxmannath.job_scraper_backend.services;



import com.laxmannath.job_scraper_backend.models.Job;
import com.laxmannath.job_scraper_backend.models.User;
import com.laxmannath.job_scraper_backend.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Pattern;
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
        List<String> raw = new ArrayList<>();
        if (user.getPreferredTitles() != null) raw.addAll(user.getPreferredTitles());
        if (user.getSkills() != null) raw.addAll(user.getSkills());

        return raw.stream()
                .flatMap(k -> Arrays.stream(k.toLowerCase().split("\\s+"))) // split multi-word phrases into single words
                .map(String::trim)
                .filter(k -> k.length() >= 3) // drop very short/noisy words
                .distinct()
                .collect(Collectors.toList());
    }

    private boolean matchesKeywords(Job job, List<String> keywords) {
        String searchableText = (job.getTitle() + " " + safe(job.getDescription())).toLowerCase();

        return keywords.stream().anyMatch(keyword -> {
            String pattern = "\\b" + Pattern.quote(keyword) + "\\b";
            return Pattern.compile(pattern).matcher(searchableText).find();
        });
    }

    private String safe(String s) {
        return s == null ? "" : s;
    }
}