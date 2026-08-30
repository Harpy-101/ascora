package com.ascora.api.exercise.dto;

import java.util.List;
import java.util.Map;

// an object for representing the exercise details objects to be returned to the user
public record ExerciseDetailsDto(
    String exerciseId, 
    String name, 
    String imageUrl,
    Map<String, String>imageUrls,
    List<String>equipments,
    List<String> bodyParts,
    String exerciseType, 
    List<String> targetMuscles, 
    List<String> secondaryMuscles, 
    String videoUrl,
    String overview, 
    List<String>instructions, 
    List<String>exerciseTips,
    List<String> variations,
    List<String> relatedExerciseIds
) {}
