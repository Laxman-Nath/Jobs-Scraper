package com.laxmannath.job_scraper_backend.utils;

import java.security.MessageDigest;
import java.nio.charset.StandardCharsets;

public class IdGenerator {

    public static String generateExternalId(String company, String title) {
        try {
            MessageDigest md = MessageDigest.getInstance("MD5");
            byte[] hash = md.digest((company + "|" + title).toLowerCase().getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : hash) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
}
