package com.laxmannath.job_scraper_backend.controllers;


import com.laxmannath.job_scraper_backend.dtos.ProfileUpdateRequest;
import com.laxmannath.job_scraper_backend.models.Job;
import com.laxmannath.job_scraper_backend.models.User;
import com.laxmannath.job_scraper_backend.services.ProfileService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/me")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    @GetMapping
    public User getProfile(Authentication authentication) {
        return profileService.getProfile(authentication.getName());
    }

    @PatchMapping
    public User updateProfile(Authentication authentication, @RequestBody ProfileUpdateRequest updates) {
        return profileService.updateProfile(authentication.getName(), updates);
    }

    @GetMapping("/recommendations")
    public List<Job> getRecommendations(Authentication authentication) {
        return profileService.getRecommendations(authentication.getName());
    }
}
