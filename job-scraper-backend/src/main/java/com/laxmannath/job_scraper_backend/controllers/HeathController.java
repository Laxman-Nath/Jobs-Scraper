package com.laxmannath.job_scraper_backend.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/health")
public class HeathController {

    @GetMapping
    public String health(){
        return "App is running...";
    }

}
