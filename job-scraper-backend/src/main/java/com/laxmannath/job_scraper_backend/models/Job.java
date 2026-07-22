package com.laxmannath.job_scraper_backend.models;


import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.io.Serializable;
import java.time.LocalDateTime;

@Entity
@Table(name = "jobs", uniqueConstraints = @UniqueConstraint(columnNames = {"source", "externalId"}))
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class Job extends  Auditable implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String source;        // "llm_extract", "greenhouse", etc.
    private String externalId;    // synthetic hash for LLM-extracted jobs, real ID for ATS sources
    private String title;
    private String company;
    private String location;
    private String url;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String postedAt;

    private LocalDateTime firstSeenAt;
    private LocalDateTime lastSeenAt;

    private String status = "active"; // active | closed
}
