package com.laxmannath.job_scraper_backend.models;



import com.laxmannath.job_scraper_backend.enums.Role;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "users", uniqueConstraints = @UniqueConstraint(columnNames = "email"))
@Data
@EqualsAndHashCode(callSuper = true)
@NoArgsConstructor
public class User extends Auditable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    private Boolean enabled = true;
    private Boolean emailVerified = false;
    private String verificationToken;
    private LocalDateTime verificationTokenExpiresAt;

    @Column(nullable = false)
    private Integer verificationAttempts = 0;

    @ElementCollection
    @CollectionTable(name = "user_preferred_titles", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "title")
    private List<String> preferredTitles;

    @ElementCollection
    @CollectionTable(name = "user_skills", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "skill")
    private List<String> skills;

    @ElementCollection
    @CollectionTable(name = "user_preferred_locations", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "location")
    private List<String> preferredLocations;

    private Boolean profileComplete = false;
    private Boolean emailNotificationsEnabled = true;

    private String resetPasswordToken;
    private LocalDateTime resetPasswordTokenExpiresAt;

    @Column(nullable = false)
    private Integer resetPasswordAttempts = 0;

    @ElementCollection
    @CollectionTable(name = "user_muted_companies", joinColumns = @JoinColumn(name = "user_id"))
    @Column(name = "company_name")
    private List<String> mutedCompanies;
}