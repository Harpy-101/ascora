package com.ascora.api.jobs.outbox;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ascora.api.sync.domain.AggregateType;

import lombok.RequiredArgsConstructor;
import tools.jackson.databind.ObjectMapper;
import tools.jackson.databind.node.ObjectNode;

@Service
@RequiredArgsConstructor
public class JobOutboxService {
   
    private final JobOutboxRepository repository;
    private final ObjectMapper objectMapper;

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
