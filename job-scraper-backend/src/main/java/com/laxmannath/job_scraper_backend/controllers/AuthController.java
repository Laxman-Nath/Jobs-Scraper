package com.laxmannath.job_scraper_backend.controllers;

import com.laxmannath.job_scraper_backend.dtos.AuthSuccessResponse;
import com.laxmannath.job_scraper_backend.dtos.LoginRequest;
import com.laxmannath.job_scraper_backend.dtos.RefreshRequest;
import com.laxmannath.job_scraper_backend.dtos.RegisterRequest;
import com.laxmannath.job_scraper_backend.services.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public AuthSuccessResponse registerUser(@RequestBody RegisterRequest registerRequest){
        return authService.register(registerRequest);
    }

    @PostMapping("/login")
    public AuthSuccessResponse login(@RequestBody LoginRequest loginRequest){
        return authService.login(loginRequest);
    }
    @PostMapping("/refresh")
    public AuthSuccessResponse refresh(@RequestBody RefreshRequest refreshRequest){
      return authService.refresh(refreshRequest);
    }

}
