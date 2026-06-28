package com.ascora.api.exercise.dto;

import java.util.List;

public record ExerciseSearchResponse(
        List<ExerciseDto> data,
        String nextCursor,
        String previousCursor
) {}