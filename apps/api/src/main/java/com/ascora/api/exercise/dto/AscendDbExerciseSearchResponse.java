package com.ascora.api.exercise.dto;

import java.util.List;

public record AscendDbExerciseSearchResponse(
        List<AscendDbExerciseDto> data,
        String nextCursor,
        String previousCursor
) {}
