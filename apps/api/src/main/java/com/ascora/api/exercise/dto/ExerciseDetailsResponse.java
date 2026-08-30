package com.ascora.api.exercise.dto;

// an object for passing the exercise details response
// its the same as AscendDbExerciseDetailsResponse. i'ts just under a different name
public record ExerciseDetailsResponse(
    Boolean success, 
    ExerciseDetailsDto data
) {}
