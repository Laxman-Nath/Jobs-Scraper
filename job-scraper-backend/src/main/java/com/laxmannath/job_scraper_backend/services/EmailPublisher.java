package com.laxmannath.job_scraper_backend.services;


import com.laxmannath.job_scraper_backend.configs.RabbitMQConfig;
import com.laxmannath.job_scraper_backend.dtos.EmailMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailPublisher {

    private final RabbitTemplate rabbitTemplate;

    public void publishEmail(String to, String subject, String body) {
        EmailMessage message = new EmailMessage(to, subject, body);
        rabbitTemplate.convertAndSend(
                RabbitMQConfig.EMAIL_EXCHANGE,
                RabbitMQConfig.EMAIL_ROUTING_KEY,
                message
        );
    }
}
