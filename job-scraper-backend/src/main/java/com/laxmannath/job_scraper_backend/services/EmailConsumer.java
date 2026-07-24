package com.laxmannath.job_scraper_backend.services;




import com.laxmannath.job_scraper_backend.configs.RabbitMQConfig;
import com.laxmannath.job_scraper_backend.dtos.EmailMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import org.springframework.web.reactive.function.client.WebClientResponseException;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailConsumer {

    private final WebClient webClient;

    @Value("${mailjet.api.key}")
    private String mailjetApiKey;

    @Value("${mailjet.secret.key}")
    private String mailjetSecretKey;

    @Value("${app.from-email}")
    private String fromEmail;

    @RabbitListener(queues = RabbitMQConfig.EMAIL_QUEUE)
    public void handleEmail(EmailMessage emailMessage) {
        log.info("=== CONSUMER TRIGGERED for: {} ===", emailMessage.getTo());
        try {
            webClient.post()
                    .uri("https://api.mailjet.com/v3.1/send")
                    .headers(headers -> headers.setBasicAuth(mailjetApiKey, mailjetSecretKey))
                    .bodyValue(Map.of(
                            "Messages", List.of(Map.of(
                                    "From", Map.of("Email", fromEmail, "Name", "JobFinder"),
                                    "To", List.of(Map.of("Email", emailMessage.getTo())),
                                    "Subject", emailMessage.getSubject(),
                                    "TextPart", emailMessage.getBody()
                            ))
                    ))
                    .retrieve()
                    .toBodilessEntity()
                    .block();

            log.info("=== Email sent to {} ===", emailMessage.getTo());
        } catch (WebClientResponseException e) {
            log.error("=== Failed to send email to {}: {} - Response: {} ===",
                    emailMessage.getTo(), e.getStatusCode(), e.getResponseBodyAsString());
        } catch (Exception e) {
            log.error("=== Failed to send email to {}: {} ===", emailMessage.getTo(), e.getMessage());
        }
    }
}