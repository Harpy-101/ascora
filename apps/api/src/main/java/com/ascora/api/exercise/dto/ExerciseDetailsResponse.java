package com.ascora.api.exercise.dto;

public record ExerciseDetailsResponse(
    Boolean success, 
    ExerciseDetailsDto data
) {}
