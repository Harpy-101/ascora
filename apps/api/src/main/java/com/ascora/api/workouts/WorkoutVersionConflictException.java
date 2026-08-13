package com.ascora.api.workouts;

import java.util.UUID;

public class WorkoutVersionConflictException extends RuntimeException {
    private final UUID workoutId;
    private final long expectedVersion;

    public WorkoutVersionConflictException(UUID workoutId, long expectedServerVersion) {
        super(String.format(
            "Version conflict for workout %s. Expected cloud version: %d, but no matching record was found.", 
            workoutId, expectedServerVersion
        ));
        this.workoutId = workoutId;
        this.expectedVersion = expectedServerVersion;
    }

    public UUID getWorkoutId() { return workoutId; }
    public long getExpectedVersion() { return expectedVersion; }
}
