package com.laxmannath.job_scraper_backend.repository;

import com.laxmannath.job_scraper_backend.models.Job;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JobRepository extends  JpaRepository<Job,Long> {
    Optional<Job> findBySourceAndExternalId(String source, String externalId);

}
