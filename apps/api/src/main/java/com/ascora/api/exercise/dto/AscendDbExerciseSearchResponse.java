package com.ascora.api.exercise.dto;

import java.util.List;

// an object for representing the result of the users exercise search
public record AscendDbExerciseSearchResponse(
        List<AscendDbExerciseDto> data,
        String nextCursor,
        String previousCursor
) {}
