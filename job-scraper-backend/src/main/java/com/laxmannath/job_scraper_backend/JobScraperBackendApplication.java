package com.laxmannath.job_scraper_backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class JobScraperBackendApplication {

	public static void main(String[] args) {
		SpringApplication.run(JobScraperBackendApplication.class, args);
	}

}
