package com.ascora.api.exercise.dto;

import java.util.List;

// an objeect for representing the an exercise in the shape the mobile app expects to recive
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