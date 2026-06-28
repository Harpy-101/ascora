package com.ascora.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "ascend-db")
public record AscendDbProperties(
        String baseUrl,
        String rapidapiHost,
        String apiKey
) {}
