package com.laxmannath.job_scraper_backend.configs;


import org.springframework.amqp.core.*;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.amqp.support.converter.MessageConverter;
@Configuration
public class RabbitMQConfig {

    public static final String EMAIL_QUEUE = "email.queue";
    public static final String EMAIL_EXCHANGE = "email.exchange";
    public static final String EMAIL_ROUTING_KEY = "email.send";

    @Bean
    public Queue emailQueue() {
        return new Queue(EMAIL_QUEUE, true); // durable — survives broker restart
    }

    @Bean
    public DirectExchange emailExchange() {
        return new DirectExchange(EMAIL_EXCHANGE);
    }

    @Bean
    public Binding emailBinding(Queue emailQueue, DirectExchange emailExchange) {
        return BindingBuilder.bind(emailQueue).to(emailExchange).with(EMAIL_ROUTING_KEY);
    }

    @Bean
    public MessageConverter jsonMessageConverter() {
        return new org.springframework.amqp.support.converter.Jackson2JsonMessageConverter();
    }
}
