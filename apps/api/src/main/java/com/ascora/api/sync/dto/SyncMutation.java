package com.ascora.api.sync.dto;

import java.util.UUID;

import com.ascora.api.sync.domain.AggregateType;
import com.ascora.api.sync.domain.SyncOperation;
import tools.jackson.databind.JsonNode;

// an object for comunicating the local mutation
public record SyncMutation(
    UUID mutationId,
    AggregateType aggregateType,
    UUID aggregateId,
    SyncOperation operation,
    long localRevision,
    Long baseServerVersion,
    JsonNode data
) {}
