package com.ascora.api.analysis.worker;

import java.math.BigDecimal;
import java.time.Duration;

import org.springframework.stereotype.Component;

import com.ascora.api.analysis.dto.WorkoutSummaryInsightData;
import com.ascora.api.analysis.messaging.WorkoutAnalysisJob;
import com.ascora.api.insights.service.InsightService;
import com.ascora.api.workouts.Workout;
import com.ascora.api.workouts.WorkoutRepository;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WorkoutAnalysisWorker {
    private final WorkoutRepository workoutRepository;
    private final InsightService insightService;

    public void process(
        WorkoutAnalysisJob job
    ) {
        var workout = workoutRepository
            .findById(job.workoutId())
            .orElseThrow(() -> 
                new IllegalStateException(
                    "Workout not found: " + job.workoutId()
                )
            );

        var analysis = analyzeWorkout(workout);

        insightService.createWorkoutSummary(
            job.jobId(), 
            workout.userId(), 
            workout.id(), 
            analysis
        );
        
        System.out.println(
            "Processing workout analysis job "
                + job.jobId()
                + " for workout "
                + job.workoutId()
        );

    }

    private WorkoutSummaryInsightData analyzeWorkout(
        Workout workout
    ) {
        int totalSets = 0;
        int completedSets = 0;
        int totalReps = 0;

        BigDecimal totalVolume =
            BigDecimal.ZERO;

        for (var exercise : workout.exercises()) {
            for (var set : exercise.sets()) {
                totalSets++;

                if (!set.completed()) {
                    continue;
                }

                completedSets++;

                int reps =
                    set.reps() != null
                        ? set.reps()
                        : 0;

                BigDecimal weight =
                    set.weightInKg() != null
                        ? set.weightInKg()
                        : BigDecimal.ZERO;

                totalReps += reps;

                totalVolume =
                    totalVolume.add(
                        weight.multiply(
                            BigDecimal.valueOf(reps)
                        )
                    );
            }
        }

        long durationMinutes = 0;

        if (
            workout.startedAt() != null &&
            workout.completedAt() != null
        ) {
            durationMinutes =
                Duration.between(
                    workout.startedAt(),
                    workout.completedAt()
                ).toMinutes();
        }

        return new WorkoutSummaryInsightData(
            totalSets,
            completedSets,
            totalReps,
            totalVolume,
            durationMinutes
        );
    }
}
