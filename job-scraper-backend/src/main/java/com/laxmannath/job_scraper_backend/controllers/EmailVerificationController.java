package com.laxmannath.job_scraper_backend.controllers;



import com.laxmannath.job_scraper_backend.dtos.ResendVerificationRequest;
import com.laxmannath.job_scraper_backend.dtos.VerifyEmailRequest;
import com.laxmannath.job_scraper_backend.services.EmailVerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
@RequiredArgsConstructor
public class EmailVerificationController {

    private final EmailVerificationService emailVerificationService;

    @PostMapping("/verify")
    public void verifyEmail(@RequestBody VerifyEmailRequest request) {
        emailVerificationService.verifyCode(request.email(), request.code());
    }

    @PostMapping("/resend")
    public void resendVerification(@RequestBody ResendVerificationRequest request) {
        emailVerificationService.resendVerificationEmail(request.email());
    }
}
