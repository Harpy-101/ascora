package com.ascora.api.analysis.messaging;

import java.util.UUID;

// The minimal workout data needed re-construct the workout for anaylsis
public record WorkoutAnalysisJob(
    UUID jobId,
    UUID workoutId
) {}