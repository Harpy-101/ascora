package com.ascora.api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpHeaders;
import org.springframework.web.reactive.function.client.WebClient;

@Configuration
public class WebClientConfig {

    @Bean
    public WebClient ascendDbWebClient(
        WebClient.Builder builder,
        AscendDbProperties properties
    ) {
        return builder
            .baseUrl(properties.baseUrl())
            .defaultHeader("x-rapidapi-key", properties.apiKey())
            .defaultHeader("x-rapidapi-host", properties.rapidapiHost())
            .defaultHeader(HttpHeaders.ACCEPT, "application/json")
            .build();
    }
}