package com.ascora.api.exercise.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.ascora.api.exercise.dto.AscendDbExerciseDto;
import com.ascora.api.exercise.dto.AscendDbExerciseSearchResponse;
import com.ascora.api.exercise.dto.ExerciseDto;
import com.ascora.api.exercise.dto.ExerciseSearchResponse;

/**
 * a mappign class to transform the retuned results from the api to the format the mobile app expects
 * ExerciseMapper
 */
@Component
public class ExerciseMapper {

    /**
     * 
     * @param response the response from the api
     * @return the expected data shape the mobile app expects
     */
    public ExerciseSearchResponse toExerciseSearchResponse(
        AscendDbExerciseSearchResponse response
    ) {
        List<ExerciseDto> exercises = response.data()
                .stream()
                .map(this::toExerciseDto)
                .toList();

        return new ExerciseSearchResponse(
                exercises,
                response.nextCursor(),
                response.previousCursor()
        );
    }

    // a function for mapping the exercises
    private ExerciseDto toExerciseDto(AscendDbExerciseDto external) {
        return new ExerciseDto(
                external.exerciseId(),
                external.name(),
                external.imageUrl(),
                external.bodyParts(),
                external.equipments(),
                external.exerciseType(),
                external.targetMuscles(),
                external.secondaryMuscles()
        );
    }
}