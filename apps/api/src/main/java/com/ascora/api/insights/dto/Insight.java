package com.ascora.api.insights.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import tools.jackson.databind.JsonNode;

// a generic obect for represnting an insight 
public record Insight(
    UUID id,
    UUID userId,
    UUID sourceJobId,
    UUID sourceAggregateId,
    String sourceAggregateType,
    String insightType,
    String title,
    String message,
    JsonNode data,
    OffsetDateTime createdAt
) {}