package com.ascora.api.exercise.dto;

import java.util.List;

// an object for representing the reerned exercise search 
public record AscendDbExerciseDto(
        String exerciseId,
        String name,
        String imageUrl,
        List<String> bodyParts,
        List<String> equipments,
        String exerciseType,
        List<String> targetMuscles,
        List<String> secondaryMuscles,
        List<String> keywords
) {}
