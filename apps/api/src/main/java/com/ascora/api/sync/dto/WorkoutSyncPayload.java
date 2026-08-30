package com.ascora.api.sync.dto;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

// an object representing a workout change is 'its passed by the user'
public record WorkoutSyncPayload(
    UUID id,
    String name,
    String status,
    OffsetDateTime startedAt,
    OffsetDateTime completedAt,
    List<WorkoutExerciseSyncPayload> exercises
) {}