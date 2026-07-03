package com.ascora.api.exercise.mapper;

import org.springframework.stereotype.Component;

import com.ascora.api.exercise.dto.AscendDbExerciseDetailsResponse;
import com.ascora.api.exercise.dto.ExerciseDetailsDto;
import com.ascora.api.exercise.dto.ExerciseDetailsResponse;

@Component
public class ExerciseDetailsMapper {
    public ExerciseDetailsResponse toExerciseDetailsResponse(AscendDbExerciseDetailsResponse response) {
        ExerciseDetailsDto exercies = toExerciseDetailsDto(response);

        return new ExerciseDetailsResponse(
            true, exercies
        );

    } 

    private ExerciseDetailsDto toExerciseDetailsDto(AscendDbExerciseDetailsResponse external) {
        return new ExerciseDetailsDto(
            external.data().exerciseId(), 
            external.data().name(), 
            external.data().imageUrl(),
            external.data().imageUrls(),
            external.data().equipments(),
            external.data().bodyParts(), 
            external.data().exerciseType(), 
            external.data().targetMuscles(), 
            external.data().secondaryMuscles(), 
            external.data().videoUrl(), 
            external.data().overview(), 
            external.data().instructions(), 
            external.data().exerciseTips(), 
            external.data().variations(), 
            external.data().relatedExerciseIds()
        );
    }
}
