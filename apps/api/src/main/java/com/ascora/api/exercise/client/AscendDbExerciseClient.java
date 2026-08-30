package com.ascora.api.exercise.client;

import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import com.ascora.api.exercise.dto.AscendDbExerciseDetailsResponse;
import com.ascora.api.exercise.dto.AscendDbExerciseSearchResponse;
import com.ascora.api.exercise.dto.ExerciseSearchRequest;

import lombok.RequiredArgsConstructor;

/**
 * a class for facilitating the fetch requests to the ascenddb API
 * AscendDbExerciseClient
 */
@Component
@RequiredArgsConstructor
public class AscendDbExerciseClient {
    private final WebClient ascendDbWebClient;

    /**
     * the function resposible for fetching the search results based on the users input
     * @param request the users request
     * @return the resulted exericse list 
     */
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

    /**
     * a function meant for getting an exercises specific details (guides, body parts and so on) for the exercise details page
     * @param exerciseId
     * @return the exercise details
     */
    public AscendDbExerciseDetailsResponse getExerciseDetails(String exerciseId) {
        return ascendDbWebClient
            .get()
            .uri(uriBuilder -> uriBuilder
                .path("/exercises/{exerciseId}")
                .build(exerciseId)
            )
            .retrieve()
            .onStatus(
                status -> status.is4xxClientError() || status.is5xxServerError(), 
                response -> response.bodyToMono(String.class)
                    .map(body -> new RuntimeException(
                          "AscendDB exercise details error "
                        + response.statusCode()
                        + ": "
                        + body
                    ))
            )
            .bodyToMono(AscendDbExerciseDetailsResponse.class)
            .block();
    }
}
