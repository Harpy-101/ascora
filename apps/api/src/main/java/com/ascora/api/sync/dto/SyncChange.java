package com.ascora.api.sync.dto;

import java.util.UUID;

import com.ascora.api.sync.domain.AggregateType;
import com.ascora.api.sync.domain.SyncOperation;

import tools.jackson.databind.JsonNode;


public record SyncChange(
    String cursor,
    AggregateType aggregateType,
    UUID aggregateId,
    SyncOperation operation,
    long serverVersion,
    JsonNode data
) {}