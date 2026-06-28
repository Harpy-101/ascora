package com.ascora.api.exercise.client;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.ascora.api.exercise.dto.AscendDbExerciseSearchResponse;
import com.ascora.api.exercise.dto.ExerciseSearchRequest;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class AscendDbExerciseClient {
    private final WebClient ascendDbWebClient;

    public AscendDbExerciseSearchResponse searchExercises(
        ExerciseSearchRequest request
    ) {
        return ascendDbWebClient
            .get()
            .uri(uriBuilder -> {
                uriBuilder.path("/exercises");
            
                if (request.name() != null) {
                    uriBuilder.queryParam("name", request.name());
                }

                if (request.bodyParts() != null) {
                    uriBuilder.queryParam("bodyParts", request.bodyParts());
                }

                if (request.equipments() != null) {
                    uriBuilder.queryParam("equipments", request.equipments());
                }

                if (request.exerciseType() != null) {
                    uriBuilder.queryParam("exerciseType", request.exerciseType());
                }

                uriBuilder.queryParam("limit", request.limit());

                if (request.after() != null) {
                    uriBuilder.queryParam("after", request.after());
                }
                return uriBuilder.build();
            })
            .retrieve()
            .bodyToMono(AscendDbExerciseSearchResponse.class)
            .block();
    }
}
