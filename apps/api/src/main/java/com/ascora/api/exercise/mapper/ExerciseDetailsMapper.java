package com.ascora.api.exercise.mapper;

import org.springframework.stereotype.Component;

import com.ascora.api.exercise.dto.AscendDbExerciseDetailsResponse;
import com.ascora.api.exercise.dto.ExerciseDetailsDto;
import com.ascora.api.exercise.dto.ExerciseDetailsResponse;

/**
 * a mapper class for transforming the api response to the shape the mobile app is expecting
 * ExerciseDetailsMapper
 */
@Component
public class ExerciseDetailsMapper {
    
    /**
     * 
     * @param response the api response
     * @return the mapped version of the response to be passed to the client 
     */
    public ExerciseDetailsResponse toExerciseDetailsResponse(AscendDbExerciseDetailsResponse response) {
        ExerciseDetailsDto exercies = toExerciseDetailsDto(response);

        return new ExerciseDetailsResponse(
            true, exercies
        );

    } 

    /**
     * a function for building th eexpected shape to be presented in the exercise details screen
     * @param external
     * @returnthe prepared version
     */
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
