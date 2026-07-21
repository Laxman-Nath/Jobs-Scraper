package com.laxmannath.job_scraper_backend.services;


import com.laxmannath.job_scraper_backend.dtos.ProfileUpdateRequest;
import com.laxmannath.job_scraper_backend.exceptions.ResourceNotFoundException;

import com.laxmannath.job_scraper_backend.models.Job;
import com.laxmannath.job_scraper_backend.models.User;
import com.laxmannath.job_scraper_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProfileService {

    private final UserRepository userRepository;
    private final RecommendationService recommendationService;

    public User getProfile(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public User updateProfile(String email, ProfileUpdateRequest updates) {
        User user = getProfile(email); // reuse the lookup above

        if (updates.getPreferredTitles() != null) user.setPreferredTitles(updates.getPreferredTitles());
        if (updates.getSkills() != null) user.setSkills(updates.getSkills());
        if (updates.getPreferredLocations() != null) user.setPreferredLocations(updates.getPreferredLocations());
        if (updates.getEmailNotificationsEnabled() != null) user.setEmailNotificationsEnabled(updates.getEmailNotificationsEnabled());
        if (updates.getMutedCompanies() != null) user.setMutedCompanies(updates.getMutedCompanies());
        boolean hasEnoughInfo = user.getPreferredTitles() != null && !user.getPreferredTitles().isEmpty();
        user.setProfileComplete(hasEnoughInfo);

        return userRepository.save(user);
    }

    public List<Job> getRecommendations(String email) {
        User user = getProfile(email);
        return recommendationService.getRecommendationsForUser(user);
    }

    public User toggleMuteCompany(String email, String companyName) {
        User user = getProfile(email);
        List<String> muted = user.getMutedCompanies() != null ? new ArrayList<>(user.getMutedCompanies()) : new ArrayList<>();

        if (muted.contains(companyName)) {
            muted.remove(companyName);
        } else {
            muted.add(companyName);
        }

        user.setMutedCompanies(muted);
        return userRepository.save(user);
    }
}
