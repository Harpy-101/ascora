package com.ascora.api.sync.dto;

import java.util.UUID;

import com.ascora.api.sync.domain.AggregateType;
import com.ascora.api.sync.domain.SyncOperation;

// a representation of a sync_chnages table row
public record SyncChangeRecord(
    long userSequence,
    UUID userId,
    AggregateType aggregateType,
    UUID aggregateId,
    SyncOperation operation,
    long serverVersion,
    UUID mutationId,
    String originDeviceId,
    String payload
) {}