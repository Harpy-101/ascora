package com.ascora.api.sync.dto;

import java.util.List;
import java.util.UUID;

public record WorkoutExerciseSyncPayload(
    UUID id,
    String exerciseId,
    String exerciseName,
    int position,
    List<WorkoutSetSyncPayload> sets
) {}