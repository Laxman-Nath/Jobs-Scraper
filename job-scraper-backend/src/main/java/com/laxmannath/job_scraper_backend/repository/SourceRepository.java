package com.laxmannath.job_scraper_backend.repository;

import com.laxmannath.job_scraper_backend.models.Source;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
public interface SourceRepository extends JpaRepository<Source,Long> {
    @Query("""
        SELECT s FROM Source s
        WHERE LOWER(s.companyName) LIKE LOWER(CONCAT('%', :query, '%'))
        OR LOWER(s.url) LIKE LOWER(CONCAT('%', :query, '%'))
    """)
    Page<Source> searchSources(@Param("query") String query, Pageable pageable);
}
