package com.ascora.api.exercise.dto;

// a representation of the search query coming from the user
public record ExerciseSearchRequest(
        String name,
        String bodyParts,
        String equipments,
        String exerciseType,
        Integer limit,
        String after
) {
    // a function meant for making sure all the values are trimmed and ready to be sent to the api endpoint
    public ExerciseSearchRequest normalized() {
        return new ExerciseSearchRequest(
            clean(name),
            clean(bodyParts),
            clean(equipments),
            clean(exerciseType),
            normalizeLimit(limit),
            clean(after)
        );
    }

    // preparing the actual values
    private static String clean(String value) {
        if (value == null) return null;

        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private static int normalizeLimit(Integer value) {
        if (value == null) return 20;
        return Math.max(1, Math.min(value, 25));
    }
}