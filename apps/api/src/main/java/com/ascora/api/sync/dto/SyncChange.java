package com.ascora.api.sync.dto;

import java.util.UUID;

import com.ascora.api.sync.domain.AggregateType;
import com.ascora.api.sync.domain.SyncOperation;

import tools.jackson.databind.JsonNode;

// an opbject for comunicating to the user server changes that they need to respond to
public record SyncChange(
    String cursor,
    AggregateType aggregateType,
    UUID aggregateId,
    SyncOperation operation,
    long serverVersion,
    JsonNode data
) {}