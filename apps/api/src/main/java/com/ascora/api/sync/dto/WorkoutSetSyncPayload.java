package com.ascora.api.sync.dto;

import java.math.BigDecimal;
import java.util.UUID;

public record WorkoutSetSyncPayload(
    UUID id,
    int setNumber,
    BigDecimal weightInKg,
    Integer reps,
    boolean completed
) {}