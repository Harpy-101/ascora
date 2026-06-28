package com.ascora.api.exercise.mapper;

import java.util.List;

import org.springframework.stereotype.Component;

import com.ascora.api.exercise.dto.AscendDbExerciseDto;
import com.ascora.api.exercise.dto.AscendDbExerciseSearchResponse;
import com.ascora.api.exercise.dto.ExerciseDto;
import com.ascora.api.exercise.dto.ExerciseSearchResponse;

@Component
public class ExerciseMapper {

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