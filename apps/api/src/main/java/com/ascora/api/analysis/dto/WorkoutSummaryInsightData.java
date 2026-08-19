package com.ascora.api.analysis.dto;

import java.math.BigDecimal;

public record WorkoutSummaryInsightData(
    int totalSets,
    int completedSets,
    int totalReps,
    BigDecimal totalVolumeKg,
    long durationMinutes
) {}