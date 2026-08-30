package com.ascora.api.sync.dto;

import java.util.List;
import java.util.UUID;

// an object representing thw workouts exercise as it's passed by the user
public record WorkoutExerciseSyncPayload(
    UUID id,
    String exerciseId,
    String exerciseName,
    int position,
    List<WorkoutSetSyncPayload> sets
) {}