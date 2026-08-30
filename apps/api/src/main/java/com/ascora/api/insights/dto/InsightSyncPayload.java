package com.ascora.api.insights.dto;

import java.time.OffsetDateTime;
import java.util.UUID;

import tools.jackson.databind.JsonNode;

// an object for representing an insight's data for sync
public record InsightSyncPayload(
    UUID sourceAggregateId,
    String sourceAggregateType,
    String insightType,
    String title,
    String message,
    JsonNode data, 
    OffsetDateTime createdAt
) {}