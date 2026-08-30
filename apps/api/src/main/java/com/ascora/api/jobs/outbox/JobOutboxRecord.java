package com.ascora.api.jobs.outbox;

import java.util.UUID;

import com.ascora.api.sync.domain.AggregateType;

import tools.jackson.databind.JsonNode;

// an object to represent a job 
public record JobOutboxRecord(
    UUID id, 
    UUID aggregateId,
    AggregateType aggregateType,
    String jobType,
    JsonNode payload
) {} 
