package com.laxmannath.job_scraper_backend.repository;

import com.laxmannath.job_scraper_backend.models.Source;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SourceRepository extends JpaRepository<Source,Long> {
}
