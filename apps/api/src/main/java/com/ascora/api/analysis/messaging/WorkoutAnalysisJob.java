package com.ascora.api.analysis.messaging;

import java.util.UUID;

public record WorkoutAnalysisJob(
    UUID jobId,
    UUID workoutId
) {}