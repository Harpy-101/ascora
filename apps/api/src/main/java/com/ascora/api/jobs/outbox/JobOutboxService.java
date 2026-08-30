package com.ascora.api.jobs.outbox;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ascora.api.sync.domain.AggregateType;

import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

/**
 * a class for initiating jobs (anaylysis jobs in this case)
 * JobOutboxService
 */
@Service
@RequiredArgsConstructor
public class JobOutboxService {
   
    private final JobOutboxRepository repository;
    private final ObjectMapper objectMapper;

    /**
     * a function for requesting a wokrout anaylisis 
     * @param userId
     * @param workoutId
     * @param sourceMutationId
     * @param serverVersion
     */
    public void enqueueWorkoutAnalysis(
        UUID userId,
        UUID workoutId,
        UUID sourceMutationId,
        long serverVersion
    ) {
        UUID jobId = UUID.randomUUID();

        ObjectNode data =
            objectMapper.createObjectNode();

        data.put(
            "userId",
            userId.toString()
        );

        data.put(
            "workoutId",
            workoutId.toString()
        );

        data.put(
            "serverVersion",
            serverVersion
        );

        var job = new JobOutboxRecord(
            jobId,
            workoutId,
            AggregateType.WORKOUT,
            "workout_analysis",
            data
        );

        repository.insert(job);
    }
}
