package com.ascora.api.sync.dto;

import java.util.UUID;

import com.ascora.api.sync.domain.AggregateType;
import com.ascora.api.sync.domain.MutationStatus;

// an obect for representing acks on mutattions the user has made locally noting the server response
public record MutationAcknowledgement(
    UUID mutationId,
    AggregateType aggregateType,
    UUID aggregateId,
    long localRevision,
    MutationStatus status,
    Long serverVersion,
    MutationProblem problem
) {}