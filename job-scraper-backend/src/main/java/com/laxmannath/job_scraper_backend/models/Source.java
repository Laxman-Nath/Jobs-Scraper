package com.laxmannath.job_scraper_backend.models;


import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "sources")
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor

public class Source extends  Auditable implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String companyName;
    private String url;
    private String sourceType;      // "llm_extract" | "greenhouse" | "lever" | "adzuna" | ...

    private Boolean enabled = true;

    private String status = "active";  // "active" | "failing" | "needs_review"

    @Column(columnDefinition = "TEXT")
    private String lastError;

    private Integer jobsFoundLastRun = 0;

    private LocalDateTime lastCrawledAt;

    private LocalDateTime createdAt = LocalDateTime.now();
}
