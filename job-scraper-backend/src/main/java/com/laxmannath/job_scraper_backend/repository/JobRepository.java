package com.laxmannath.job_scraper_backend.repository;

import com.laxmannath.job_scraper_backend.models.Job;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface JobRepository extends  JpaRepository<Job,Long> {
    Optional<Job> findBySourceAndExternalId(String source, String externalId);
    Page<Job> findByStatus(String status, Pageable pageable);
    @Query("""
        SELECT j FROM Job j
        WHERE j.status = 'active'
        AND (
            LOWER(j.title) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(j.company) LIKE LOWER(CONCAT('%', :query, '%'))
            OR LOWER(j.location) LIKE LOWER(CONCAT('%', :query, '%'))
        )
    """)
    Page<Job> searchJobs(@Param("query") String query, Pageable pageable);

    Page<Job> findByCompanyIgnoreCaseAndStatus(String company, String status, Pageable pageable);
    List<Job> findAllByStatus(String status);
}
