package com.ascora.api.exercise.dto;

public record ExerciseSearchRequest(
        String name,
        String bodyParts,
        String equipments,
        String exerciseType,
        Integer limit,
        String after
) {
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