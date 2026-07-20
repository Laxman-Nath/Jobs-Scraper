package com.laxmannath.job_scraper_backend.services;



import com.laxmannath.job_scraper_backend.models.User;
import com.laxmannath.job_scraper_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class EmailVerificationService {

    private static final int MAX_ATTEMPTS = 5;
    private static final long CODE_EXPIRY_MINUTES = 15;

    private final UserRepository userRepository;
    private final EmailPublisher emailPublisher; // your existing RabbitMQ publisher

    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional
    public void sendVerificationEmail(User user) {
        String code = generateVerificationCode();

        user.setVerificationToken(hashCode(code));
        user.setVerificationTokenExpiresAt(LocalDateTime.now().plusMinutes(CODE_EXPIRY_MINUTES));
        user.setVerificationAttempts(0);
        userRepository.save(user);

        emailPublisher.publishEmail(
                user.getEmail(),
                "Verify your JobFinder account",
                "Welcome to JobFinder!\n\n" +
                        "Your verification code is: " + code + "\n\n" +
                        "Enter this code on the verification page to activate your account.\n" +
                        "This code expires in " + CODE_EXPIRY_MINUTES + " minutes."
        );
    }

    @Transactional
    public void verifyCode(String email, String code) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new IllegalStateException("Email already verified");
        }

        if (user.getVerificationTokenExpiresAt() == null
                || user.getVerificationTokenExpiresAt().isBefore(LocalDateTime.now())) {
            throw new IllegalStateException("Verification code expired");
        }

        if (user.getVerificationAttempts() >= MAX_ATTEMPTS) {
            throw new IllegalStateException("Too many attempts, request a new code");
        }

        if (!hashCode(code).equals(user.getVerificationToken())) {
            user.setVerificationAttempts(user.getVerificationAttempts() + 1);
            userRepository.save(user);
            throw new IllegalArgumentException("Invalid code");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationTokenExpiresAt(null);
        user.setVerificationAttempts(0);
        userRepository.save(user);
    }

    @Transactional
    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        if (Boolean.TRUE.equals(user.getEmailVerified())) {
            throw new IllegalStateException("Email already verified");
        }

        sendVerificationEmail(user);
    }

    private String generateVerificationCode() {
        int code = 100_000 + secureRandom.nextInt(900_000);
        return String.valueOf(code);
    }

    private String hashCode(String code) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(code.getBytes(StandardCharsets.UTF_8));
            StringBuilder hex = new StringBuilder();
            for (byte b : hash) {
                hex.append(String.format("%02x", b));
            }
            return hex.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 algorithm not available", e);
        }
    }
}