package com.ascora.api.exercise.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ascora.api.exercise.dto.ExerciseDetailsResponse;
import com.ascora.api.exercise.dto.ExerciseSearchRequest;
import com.ascora.api.exercise.dto.ExerciseSearchResponse;
import com.ascora.api.exercise.service.ExerciseSearchService;

import lombok.RequiredArgsConstructor;

@RestController 
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {
    private final ExerciseSearchService exerciseSearchService;
    @GetMapping
    public ExerciseSearchResponse searchExercise(
        @RequestParam(required = false) String name, 
        @RequestParam(required = false) String bodyParts,
        @RequestParam(required = false) String equipments,
        @RequestParam(required = false) String exerciseType,
        @RequestParam(defaultValue = "20") int limit,
        @RequestParam(required = false) String after
    ) {
        ExerciseSearchRequest request = new ExerciseSearchRequest(
            name, bodyParts, equipments, exerciseType, limit, after
        );

        var res = exerciseSearchService.searchExercise(request);
        return res;
    }

    @GetMapping("/{exerciseId}")
    public ExerciseDetailsResponse getExerciseDetails(
        @PathVariable String exerciseId
    ) {
       ExerciseDetailsResponse var = exerciseSearchService.getExerciseDetails(exerciseId);
    //    System.out.println("Response for exercise search"+ var); 
       
       return var;
    }
}
