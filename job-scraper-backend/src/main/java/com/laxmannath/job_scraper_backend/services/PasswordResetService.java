package com.laxmannath.job_scraper_backend.services;

import com.laxmannath.job_scraper_backend.models.User;
import com.laxmannath.job_scraper_backend.repository.UserRepository;
import com.laxmannath.job_scraper_backend.utils.VerificationCodeUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class PasswordResetService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long CODE_EXPIRY_MINUTES = 15;

    private final UserRepository userRepository;
    private final EmailPublisher emailPublisher;
    private final PasswordEncoder passwordEncoder; // you likely already have this for login

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public void requestReset(String email) {
        User user = userRepository.findByEmail(email).orElse(null);

        // Don't reveal whether the email exists — always respond as if it worked
        if (user == null) return;

        String code = VerificationCodeUtil.generateCode();
        user.setResetPasswordToken(VerificationCodeUtil.hash(code));
        user.setResetPasswordTokenExpiresAt(LocalDateTime.now().plusMinutes(CODE_EXPIRY_MINUTES));
        user.setResetPasswordAttempts(0);
        userRepository.save(user);

        emailPublisher.publishEmail(
                user.getEmail(),
                "Reset your JobFinder password",
                "We received a request to reset your password.\n\n" +
                        "Your reset code is: " + code + "\n\n" +
                        "Enter this code to set a new password.\n" +
                        "This code expires in " + CODE_EXPIRY_MINUTES + " minutes.\n\n" +
                        "If you didn't request this, you can safely ignore this email."
        );
    }

    @Transactional
    public void resetPassword(String email, String code, String newPassword) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid or expired code"));

        if (user.getResetPasswordTokenExpiresAt() == null
                || user.getResetPasswordTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Reset code expired");
        }

        if (user.getResetPasswordAttempts() >= MAX_ATTEMPTS) {
            throw new IllegalStateException("Too many attempts, request a new code");
        }

        if (user.getResetPasswordToken() == null || !VerificationCodeUtil.hash(code).equals(user.getResetPasswordToken())) {
            user.setResetPasswordAttempts(user.getResetPasswordAttempts() + 1);
            userRepository.save(user);
            throw new IllegalArgumentException("Invalid code");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetPasswordToken(null);
        user.setResetPasswordTokenExpiresAt(null);
        user.setResetPasswordAttempts(0);
        userRepository.save(user);
    }




}
