package com.laxmannath.job_scraper_backend.services;



import com.laxmannath.job_scraper_backend.configs.RabbitMQConfig;
import com.laxmannath.job_scraper_backend.dtos.EmailMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailConsumer {

    private final JavaMailSender mailSender;

    @RabbitListener(queues = RabbitMQConfig.EMAIL_QUEUE)
    public void handleEmail(EmailMessage emailMessage) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(emailMessage.getTo());
            message.setSubject(emailMessage.getSubject());
            message.setText(emailMessage.getBody());
            mailSender.send(message);
            System.out.println("Email sent to " + emailMessage.getTo());
        } catch (Exception e) {
            System.err.println("Failed to send email to " + emailMessage.getTo() + ": " + e.getMessage());
            // could add retry/dead-letter queue logic here later
        }
    }
}
