package com.ascora.api.exercise.service;

import org.springframework.stereotype.Service;

import com.ascora.api.exercise.client.AscendDbExerciseClient;
import com.ascora.api.exercise.dto.AscendDbExerciseSearchResponse;
import com.ascora.api.exercise.dto.ExerciseDetailsResponse;
import com.ascora.api.exercise.dto.ExerciseSearchRequest;
import com.ascora.api.exercise.dto.ExerciseSearchResponse;
import com.ascora.api.exercise.mapper.ExerciseDetailsMapper;
import com.ascora.api.exercise.mapper.ExerciseMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExerciseSearchService {
    private final AscendDbExerciseClient ascendDbExerciseClient;
    private final ExerciseMapper exerciseMapper;
    private final ExerciseDetailsMapper exerciseDetailsMapper;
    
    public ExerciseSearchResponse searchExercise(ExerciseSearchRequest request) {
        ExerciseSearchRequest normalizedRequest = request.normalized();
        AscendDbExerciseSearchResponse ascendResponse = ascendDbExerciseClient.searchExercises(normalizedRequest);

        return exerciseMapper.toExerciseSearchResponse(ascendResponse);
    }

    public ExerciseDetailsResponse getExerciseDetails(String exerciseId) {
        var externalResponse = ascendDbExerciseClient.getExerciseDetails(exerciseId);

        return exerciseDetailsMapper.toExerciseDetailsResponse(externalResponse);
    }
}
