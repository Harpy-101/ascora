package com.ascora.api.workouts;

import java.time.OffsetDateTime;
import java.util.List;
import java.util.UUID;

public record Workout(
    UUID id,
    UUID userId,
    String name,
    String status,
    OffsetDateTime startedAt,
    OffsetDateTime completedAt,
    long serverVersion,
    List<WorkoutExercise> exercises
) {};

