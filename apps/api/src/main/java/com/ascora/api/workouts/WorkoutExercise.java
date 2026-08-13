package com.ascora.api.workouts;

import java.util.List;
import java.util.UUID;

public record WorkoutExercise(
    UUID id,
    String exerciseId,
    String exerciseName,
    int position,
    List<WorkoutSet> sets
) {};