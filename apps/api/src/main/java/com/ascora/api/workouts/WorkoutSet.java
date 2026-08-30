package com.ascora.api.workouts;

import java.math.BigDecimal;
import java.util.UUID;

// a represtation of a set that is a part of an exercise
public record WorkoutSet(
    UUID id,
    int setNumber,
    BigDecimal weightInKg,
    Integer reps,
    boolean completed
) {};