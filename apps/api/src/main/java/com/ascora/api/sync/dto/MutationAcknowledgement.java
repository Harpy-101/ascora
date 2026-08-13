package com.ascora.api.sync.dto;

import java.util.UUID;

import com.ascora.api.sync.domain.AggregateType;
import com.ascora.api.sync.domain.MutationStatus;

public record MutationAcknowledgement(
    UUID mutationId,
    AggregateType aggregateType,
    UUID aggregateId,
    long localRevision,
    MutationStatus status,
    Long serverVersion,
    MutationProblem problem
) {}