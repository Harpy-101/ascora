package com.ascora.api.exercise.dto;

// an object for passing the exercise details response
// its the same as ExerciseDetailsResponse. i'ts just under a different name
public record AscendDbExerciseDetailsResponse (
    Boolean success, 
    ExerciseDetailsDto data
) {}
