package com.ascora.api.exercise.dto;

import java.util.List;

public record ExerciseDto(
        String exerciseId,
        String name,
        String imageUrl,
        List<String> bodyParts,
        List<String> equipments,
        String exerciseType,
        List<String> targetMuscles,
        List<String> secondaryMuscles
) {}