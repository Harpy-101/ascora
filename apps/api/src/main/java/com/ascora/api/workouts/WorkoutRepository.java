package com.ascora.api.workouts;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.OptionalLong;
import java.util.UUID;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import lombok.RequiredArgsConstructor;

/**
 * 
 * WorkoutRepository Not much to say its a repo
 */
@Repository
@RequiredArgsConstructor
public class WorkoutRepository {

    private final JdbcTemplate jdbc;

    /**
     * 
     * @param workoutId the workout id 
     * @param userId the user id 
     * @return a complete workout
     */
    public Optional<Workout> findByIdAndUserId(
        UUID workoutId,
        UUID userId
    ) {
        var workouts = jdbc.query(
            """
            SELECT
                id,
                user_id,
                name,
                status,
                server_version, 
                started_at,
                completed_at
            FROM workouts
            WHERE id = ?
            AND user_id = ?
            """,
            (rs, rowNum) -> new Workout(
                rs.getObject("id", UUID.class),
                rs.getObject("user_id", UUID.class),
                rs.getString("name"),
                rs.getString("status"),

                rs.getObject(
                    "started_at",
                    OffsetDateTime.class
                ),

                rs.getObject(
                    "completed_at",
                    OffsetDateTime.class
                ),
                rs.getLong("server_version"),
                List.of()
            ),
            workoutId,
            userId
        );

        if (workouts.isEmpty()) {
            return Optional.empty();
        }

        Workout base = workouts.get(0);

        var exerciseRows = jdbc.query(
            """
            SELECT
                id,
                exercise_id,
                exercise_name,
                position
            FROM workout_exercises
            WHERE workout_id = ?
            ORDER BY position
            """,
            (rs, rowNum) -> new WorkoutExercise(
                rs.getObject("id", UUID.class),
                rs.getString("exercise_id"),
                rs.getString("exercise_name"),
                rs.getInt("position"),
                List.of()
            ),
            workoutId
        );

        var exercises = new ArrayList<WorkoutExercise>();

        for (WorkoutExercise exercise : exerciseRows) {
            var sets = jdbc.query(
                """
                SELECT
                    id,
                    set_number,
                    weight_in_kg,
                    reps,
                    completed
                FROM workout_sets
                WHERE workout_exercise_id = ?
                ORDER BY set_number
                """,
                (rs, rowNum) -> new WorkoutSet(
                    rs.getObject("id", UUID.class),
                    rs.getInt("set_number"),
                    rs.getBigDecimal("weight_in_kg"),
                    rs.getObject("reps", Integer.class),
                    rs.getBoolean("completed")
                ),
                exercise.id()
            );

            exercises.add(
                new WorkoutExercise(
                    exercise.id(),
                    exercise.exerciseId(),
                    exercise.exerciseName(),
                    exercise.position(),
                    sets
                )
            );
        }

        Workout workout = new Workout(
            base.id(),
            base.userId(),
            base.name(),
            base.status(),
            base.startedAt(), 
            base.completedAt(),
            base.serverVersion(),
            exercises
        );

        return Optional.of(workout);
    } 

    /**
     * inserting a new workout
     * @param workout the workout
     * @return server version
     */
    public long insert(Workout workout) {
        long initialServerVersion = 1L;

        jdbc.update(
            """
            INSERT INTO workouts (
                id,
                user_id,
                name,
                status,
                started_at,
                completed_at,
                server_version
            )
            VALUES (?, ?, ?, ?, ?, ?, ?)
            """,
            workout.id(),
            workout.userId(),
            workout.name(),
            workout.status(),
            workout.startedAt(),
            workout.completedAt(),
            initialServerVersion
        );

        insertExercises(workout);

        return initialServerVersion;
    }

    /**
     * inserting an exercise
     * @param workout thw complete workout 
     */
    private void insertExercises(Workout workout) {
        for (WorkoutExercise exercise : workout.exercises()) {
            jdbc.update(
                """
                INSERT INTO workout_exercises (
                    id,
                    workout_id,
                    exercise_id,
                    exercise_name,
                    position
                )
                VALUES (?, ?, ?, ?, ?)
                """,
                exercise.id(),
                workout.id(),
                exercise.exerciseId(),
                exercise.exerciseName(),
                exercise.position()
            );

            insertSets(exercise);
        }
    }

    /**
     * 
     * @param exercise an exercise
     */
    private void insertSets(
        WorkoutExercise exercise
    ) {
        for (WorkoutSet set : exercise.sets()) {
            jdbc.update(
                """
                INSERT INTO workout_sets (
                    id,
                    workout_exercise_id,
                    set_number,
                    weight_in_kg,
                    reps,
                    completed
                )
                VALUES (?, ?, ?, ?, ?, ?)
                """,
                set.id(),
                exercise.id(),
                set.setNumber(),
                set.weightInKg(),
                set.reps(),
                set.completed()
            );
        }
    }

    /**
     * 
     * @param workout the complete workout
     * @param expectedServerVersion for checking/updating the current version
     * @return
     */
    public OptionalLong update(
        Workout workout, 
        long expectedServerVersion
    ) {
        var versions = jdbc.query(
            """
            UPDATE workouts
            SET
                name = ?,
                status = ?,
                server_version = server_version + 1,
                updated_at = now()
            WHERE id = ?
            AND user_id = ?
            AND server_version = ?
            RETURNING server_version
            """,
            (rs, rowNum) ->
                rs.getLong("server_version"),

            workout.name(),
            workout.status(),
            workout.id(),
            workout.userId(),
            expectedServerVersion
        );

        if (versions.isEmpty()) {
            throw new WorkoutVersionConflictException(
                workout.id(),
                expectedServerVersion
            );
        }

        long newServerVersion = versions.get(0);

        replaceWorkoutChildren(workout);

        return OptionalLong.of(newServerVersion);
    }
    
    /**
     * 
     * @param workout the complete workout
     */
    private void replaceWorkoutChildren(
        Workout workout
    ) {
        jdbc.update(
            """
            DELETE FROM workout_exercises
            WHERE workout_id = ?
            """,
            workout.id()
        );

        insertExercises(workout);
    }

    public OptionalLong delete(
        UUID workoutId,
        UUID userId,
        long expectedServerVersion
    ) {
        var versions = jdbc.query(
            """
            DELETE FROM workouts
            WHERE id = ?
            AND user_id = ?
            AND server_version = ?
            RETURNING server_version + 1
                AS tombstone_version
            """,
            (rs, rowNum) ->
                rs.getLong("tombstone_version"),
            workoutId,
            userId,
            expectedServerVersion
        );

        if (versions.isEmpty()) {
            return OptionalLong.empty();
        }

        return OptionalLong.of(
            versions.get(0)
        );
    }

    /**
     * searching a workout for internal use not for actual user facing operations
     * @param workoutId 
     * @return workout if found
     */
    public Optional<Workout> findById(UUID workoutId) {
        var result =  jdbc.query(
            """
            SELECT 
                id,
                user_id,
                name,
                status,
                server_version, 
                started_at,
                completed_at
            FROM workouts
            WHERE id = ?                
            """,
            (rs, rowNum) -> new Workout(
                rs.getObject("id", UUID.class),
                rs.getObject("user_id", UUID.class),
                rs.getString("name"),
                rs.getString("status"),

                rs.getObject(
                    "started_at",
                    OffsetDateTime.class
                ),

                rs.getObject(
                    "completed_at",
                    OffsetDateTime.class
                ),
                rs.getLong("server_version"),
                List.of()
            ),
            workoutId
        );

        if (result.isEmpty()) {
            return Optional.empty();
        }

        Workout base = result.get(0);

        var exerciseRows = jdbc.query(
            """
            SELECT
                id,
                exercise_id,
                exercise_name,
                position
            FROM workout_exercises
            WHERE workout_id = ?
            ORDER BY position
            """,
            (rs, rowNum) -> new WorkoutExercise(
                rs.getObject("id", UUID.class),
                rs.getString("exercise_id"),
                rs.getString("exercise_name"),
                rs.getInt("position"),
                List.of()
            ),
            workoutId
        );

        var exercises = new ArrayList<WorkoutExercise>();

        for (WorkoutExercise exercise : exerciseRows) {
            var sets = jdbc.query(
                """
                SELECT
                    id,
                    set_number,
                    weight_in_kg,
                    reps,
                    completed
                FROM workout_sets
                WHERE workout_exercise_id = ?
                ORDER BY set_number
                """,
                (rs, rowNum) -> new WorkoutSet(
                    rs.getObject("id", UUID.class),
                    rs.getInt("set_number"),
                    rs.getBigDecimal("weight_in_kg"),
                    rs.getObject("reps", Integer.class),
                    rs.getBoolean("completed")
                ),
                exercise.id()
            );

            exercises.add(
                new WorkoutExercise(
                    exercise.id(),
                    exercise.exerciseId(),
                    exercise.exerciseName(),
                    exercise.position(),
                    sets
                )
            );
        }

        Workout workout = new Workout(
            base.id(),
            base.userId(),
            base.name(),
            base.status(),
            base.startedAt(), 
            base.completedAt(),
            base.serverVersion(),
            exercises
        );

        return Optional.of(workout);
    }
}