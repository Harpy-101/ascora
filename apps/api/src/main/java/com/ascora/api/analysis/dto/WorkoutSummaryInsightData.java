package com.ascora.api.analysis.dto;

import java.math.BigDecimal;

// a representation of a complete workout anyalisis 
public record WorkoutSummaryInsightData(
    int totalSets,
    int completedSets,
    int totalReps,
    BigDecimal totalVolumeKg,
    long durationMinutes
) {}