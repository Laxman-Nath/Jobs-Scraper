package com.laxmannath.job_scraper_backend.services;


import com.laxmannath.job_scraper_backend.configs.RabbitMQConfig;
import com.laxmannath.job_scraper_backend.dtos.EmailMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishEmail(String to, String subject, String body) {
        log.info("=== ATTEMPTING to publish email to queue for: {} ===", to);
        try {
            EmailMessage message = new EmailMessage(to, subject, body);
            rabbitTemplate.convertAndSend(
                    com.laxmannath.job_scraper_backend.configs.RabbitMQConfig.EMAIL_EXCHANGE,
                    RabbitMQConfig.EMAIL_ROUTING_KEY,
                    message
            );
            log.info("=== SUCCESSFULLY published email to queue for: {} ===", to);
        } catch (Exception e) {
            log.error("=== FAILED to publish email to queue for: {} — {} ===", to, e.getMessage());
        }
    }
}
