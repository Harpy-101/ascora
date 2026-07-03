package com.ascora.api.exercise.dto;

public record AscendDbExerciseDetailsResponse (
    Boolean success, 
    ExerciseDetailsDto data
) {}
