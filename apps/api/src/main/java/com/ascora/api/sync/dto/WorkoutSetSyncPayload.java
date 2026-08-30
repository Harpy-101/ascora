package com.ascora.api.sync.dto;

import java.math.BigDecimal;
import java.util.UUID;

// an object representing an exercises set is it's passed by the user
public record WorkoutSetSyncPayload(
    UUID id,
    int setNumber,
    BigDecimal weightInKg,
    Integer reps,
    boolean completed
) {}