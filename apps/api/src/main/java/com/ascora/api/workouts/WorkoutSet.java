package com.ascora.api.workouts;

import java.math.BigDecimal;
import java.util.UUID;

public record WorkoutSet(
    UUID id,
    int setNumber,
    BigDecimal weightInKg,
    Integer reps,
    boolean completed
) {};