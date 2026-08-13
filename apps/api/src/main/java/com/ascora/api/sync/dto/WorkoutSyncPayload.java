package com.ascora.api.sync.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record WorkoutSyncPayload(
    UUID id,
    String name,
    String status,
    OffsetDateTime startedAt,
    OffsetDateTime completedAt,
    List<WorkoutExerciseSyncPayload> exercises
) {}