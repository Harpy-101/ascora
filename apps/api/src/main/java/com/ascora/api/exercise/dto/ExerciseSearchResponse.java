package com.ascora.api.exercise.dto;

import java.util.List;

// on object for representing the retuned eexercise search back to the user
public record ExerciseSearchResponse(
        List<ExerciseDto> data,
        String nextCursor,
        String previousCursor
) {}