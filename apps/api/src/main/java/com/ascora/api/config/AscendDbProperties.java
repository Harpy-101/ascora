package com.ascora.api.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

// a represtatntion of the necessary cradentills format needed to access the ascenddb api 
@ConfigurationProperties(prefix = "ascend-db")
public record AscendDbProperties(
        String baseUrl,
        String rapidapiHost,
        String apiKey
) {}
