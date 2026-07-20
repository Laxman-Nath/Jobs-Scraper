package com.laxmannath.job_scraper_backend.repository;

import com.laxmannath.job_scraper_backend.models.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByEmail(String email);
    boolean existsByEmail(String email);
    Optional<User> findByVerificationToken(String verificationToken);
}
