package com.ascora.api.jobs.messaging;

import java.util.Map;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jms.annotation.EnableJms;
import org.springframework.jms.support.converter.JacksonJsonMessageConverter;
import org.springframework.jms.support.converter.MessageConverter;
import org.springframework.jms.support.converter.MessageType;

import com.ascora.api.analysis.messaging.WorkoutAnalysisJob;


@Configuration
@EnableJms
public class JmsConfig {

    @Bean
    public MessageConverter jmsMessageConverter() {
        var converter =
            new JacksonJsonMessageConverter();

        converter.setTargetType(
            MessageType.TEXT
        );

        converter.setTypeIdPropertyName(
            "_type"
        );
 
        converter.setTypeIdMappings(
            Map.of(
                "workout-analysis",
                WorkoutAnalysisJob.class
            )
        );

        return converter;
    }
}