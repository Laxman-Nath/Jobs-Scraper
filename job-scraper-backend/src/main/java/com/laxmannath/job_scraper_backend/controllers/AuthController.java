package com.laxmannath.job_scraper_backend.controllers;

import com.laxmannath.job_scraper_backend.dtos.AuthSuccessResponse;
import com.laxmannath.job_scraper_backend.dtos.LoginRequest;
import com.laxmannath.job_scraper_backend.dtos.RefreshRequest;
import com.laxmannath.job_scraper_backend.dtos.RegisterRequest;
import com.laxmannath.job_scraper_backend.services.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public AuthSuccessResponse registerUser(@RequestBody RegisterRequest registerRequest, HttpServletResponse response){
        return authService.register(registerRequest,response);
    }

    @PostMapping("/login")
    public AuthSuccessResponse login(@RequestBody LoginRequest loginRequest,HttpServletResponse response){
        return authService.login(loginRequest,response);
    }
    @PostMapping("/refresh")
    public AuthSuccessResponse refresh(@CookieValue(value = "refreshToken", required = false) String refreshTokenValue,
                                       HttpServletResponse response){
      return authService.refresh(refreshTokenValue,response);
    }

    @PostMapping("/logout")
    public void logout(@CookieValue(value = "refreshToken", required = false) String refreshTokenValue,
                       HttpServletResponse response){
        this.authService.logout(refreshTokenValue,response);
    }


}
