package com.ascora.api.sync.applier;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ascora.api.jobs.outbox.JobOutboxService;
import com.ascora.api.sync.domain.AggregateType;
import com.ascora.api.sync.domain.MutationStatus;
import com.ascora.api.sync.dto.MutationAcknowledgement;
import com.ascora.api.sync.dto.MutationProblem;
import com.ascora.api.sync.dto.SyncMutation;
import com.ascora.api.sync.dto.WorkoutSyncPayload;
import com.ascora.api.sync.repository.ProcessedMutationRepository;
import com.ascora.api.sync.repository.SyncChangeRepository;
import com.ascora.api.workouts.Workout;
import com.ascora.api.workouts.WorkoutExercise;
import com.ascora.api.workouts.WorkoutRepository;
import com.ascora.api.workouts.WorkoutSet;

import lombok.RequiredArgsConstructor;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.ObjectMapper;
import java.util.OptionalLong;

/**
 * a class for facilitating the application of local user changes in workouts in the server
 * WorkoutSyncApplier
 */
@Service
@RequiredArgsConstructor
public class WorkoutSyncApplier {

    private final WorkoutRepository workoutRepository;
    private final SyncChangeRepository syncChangeRepository;
    private final ObjectMapper objectMapper;
    private final ProcessedMutationRepository processedMutationRepository;
    private final JobOutboxService jobOutboxService;

    /**
     * a function for applying the workout mutation
     * @param userId
     * @param deviceId
     * @param mutation
     * @return
     */
    @Transactional
    public MutationAcknowledgement apply(
        UUID userId,
        String deviceId,
        SyncMutation mutation
    ) {
        boolean claimed = 
            processedMutationRepository.tryClaim(userId, deviceId, mutation);
        
        if (!claimed) {
            return processedMutationRepository
                    .findAcknowledgement(userId, mutation.mutationId())
                    .orElseThrow(() -> 
                        new IllegalStateException( "Mutation exists but has no completed result: "
                        + mutation.mutationId()
                    )
                );
        }
        MutationAcknowledgement acknowledgement =
            switch (mutation.operation()) {

                case UPSERT ->
                    applyUpsert(
                        userId,
                        deviceId,
                        mutation
                    );

                case DELETE ->
                    applyDelete(
                        userId,
                        deviceId,
                        mutation
                    );
            };
        
        processedMutationRepository.complete(
            userId, mutation.mutationId(), acknowledgement
        );

        return acknowledgement;
    }
    
    /**
     * applying a mutation that is either an insert or an update
     * @param userId
     * @param deviceId
     * @param mutation
     * @return
     */
    private MutationAcknowledgement applyUpsert(
        UUID userId,
        String deviceId,
        SyncMutation mutation
    ) {
        if (mutation.data() == null) {
            return reject(
                mutation,
                "missing_payload",
                "Workout payload is required for an upsert."
            );
        }
        
        WorkoutSyncPayload payload;
        
        try {
            payload = objectMapper.treeToValue(
                mutation.data(),
                WorkoutSyncPayload.class
            );
        } catch (JacksonException e) {
            return reject(
                mutation,
                "invalid_payload",
                "Workout payload could not be parsed."
            );
        }
        
        /*
        * Prevent:
        *
        * mutation.aggregateId = A
        * payload.id           = B
        */
       if (!payload.id().equals(
           mutation.aggregateId()
        )) {
            return reject(
                mutation,
                "aggregate_id_mismatch",
                "Payload ID does not match aggregate ID."
            );
        }
        
        /*
        * No base version means:This workout has never existed on the server
        */
       if (mutation.baseServerVersion() == null) {
            return insertWorkout(
                userId,
                deviceId,
                mutation,
                payload
            );
        }
        
        return updateWorkout(
            userId,
            deviceId,
            mutation,
            payload
        );

    }
    
    /**
     * a function for handling the insertion of a supposed new workout
     * @param userId
     * @param deviceId
     * @param mutation
     * @param payload
     * @return
     */
    private MutationAcknowledgement insertWorkout(
        UUID userId,
        String deviceId,
        SyncMutation mutation,
        WorkoutSyncPayload payload
    ) {
        /*
        * a client claiming this is new shouldn't overwrit an existing workout
        */
       var existing =
       workoutRepository.findByIdAndUserId(
           mutation.aggregateId(),
           userId
        );
        
        if (existing.isPresent()) {
            return conflict(
                mutation,
                existing.get().serverVersion()
            );
        }
        
        Workout workout =
        toWorkout(
            payload,
            userId,
            1L
        );
        
        long serverVersion =
        workoutRepository.insert(workout);
        
        /*
        * noting the change so it could be passed to back to the client/s
        */
       syncChangeRepository.insertUpsert(
           userId,
           mutation.aggregateId(),
           AggregateType.WORKOUT,
           serverVersion,
           mutation.mutationId(),
           deviceId,
           mutation.data()
        );
        
        
        var acknowledgement =
        appliedAcknowledgement(
            mutation,
            serverVersion
        ); 

        boolean becameCompleted = existing.map(w -> 
            !w.status().equals("completed")
            &&
            payload.status().equals("completed")
        )
        .orElse(
            payload.status().equals("completed")
        );

        if (becameCompleted) {
            jobOutboxService.enqueueWorkoutAnalysis(
                userId,
                mutation.aggregateId(), 
                mutation.mutationId(), 
                serverVersion
            );
        }
        
        return acknowledgement;
    }

    /**
     * a fucntion for handling the updae of a supposedly preexsisting workout
     * @param userId
     * @param deviceId
     * @param mutation
     * @param payload
     * @return
     */
    private MutationAcknowledgement updateWorkout(
        UUID userId,
        String deviceId,
        SyncMutation mutation,
        WorkoutSyncPayload payload
    ) {
        long expectedVersion = mutation.baseServerVersion();
        
        var existing =
        workoutRepository.findByIdAndUserId(
           mutation.aggregateId(),
           userId
        );
        
        if (existing.isEmpty()) {
            return conflict(
                mutation,
                existing.get().serverVersion()
            );
        }

        Workout workout =
            toWorkout(
                payload,
                userId,
                expectedVersion
            );

        OptionalLong updatedVersion =
            workoutRepository.update(
                workout,
                expectedVersion
            );

        if (updatedVersion.isEmpty()) {
            var current =
                workoutRepository.findByIdAndUserId(
                    mutation.aggregateId(),
                    userId
                );

            Long currentVersion =
                current
                    .map(Workout::serverVersion)
                    .orElse(null);

            return conflict(
                mutation,
                currentVersion
            );
        }

        long serverVersion =
            updatedVersion.getAsLong();


        syncChangeRepository.insertUpsert(
            userId,
            mutation.aggregateId(),
            AggregateType.WORKOUT,
            serverVersion,
            mutation.mutationId(),
            deviceId,
            mutation.data()
        );

        var acknowledgement =
            appliedAcknowledgement(
                mutation,
                serverVersion
            );

        boolean becameCompleted = existing.map(w -> 
            !w.status().equals("completed")
            &&
            payload.status().equals("completed")
            )
            .orElse(
                payload.status().equals("completed")
            );

        if (becameCompleted) {
            jobOutboxService.enqueueWorkoutAnalysis(
                userId,
                mutation.aggregateId(), 
                mutation.mutationId(), 
                serverVersion
            );
        }
        return acknowledgement;
    }

    /**
     * a function for handling workout deletion requests coming from the user
     * @param userId
     * @param deviceId
     * @param mutation
     * @return
     */
    private MutationAcknowledgement applyDelete(
        UUID userId,
        String deviceId,
        SyncMutation mutation
    ) {
        if (mutation.baseServerVersion() == null) {
            return reject(
                mutation,
                "missing_server_version",
                "A synced workout requires a server version before deletion."
            );
        }

        long expectedVersion = mutation.baseServerVersion();

        OptionalLong deletedVersion =
            workoutRepository.delete(
                mutation.aggregateId(),
                userId,
                expectedVersion
            );

        if (deletedVersion.isEmpty()) {
            var current =
                workoutRepository.findByIdAndUserId(
                    mutation.aggregateId(),
                    userId
                );

            Long currentVersion =
                current
                    .map(Workout::serverVersion)
                    .orElse(null);

            return conflict(
                mutation,
                currentVersion
            );
        }

        long tombstoneVersion =
            deletedVersion.getAsLong();

        syncChangeRepository.insertDelete(
            userId,
            mutation.aggregateId(),
            AggregateType.WORKOUT,
            tombstoneVersion,
            mutation.mutationId(),
            deviceId
        );

        var acknowledgement =
            appliedAcknowledgement(
                mutation,
                tombstoneVersion
            );

        return acknowledgement;
    }

    /**
     * a functrion for turning a user's sync payload to an actual workout ready to be passed and refrenced locally
     * @param payload
     * @param userId
     * @param serverVersion
     * @return
     */
    private Workout toWorkout(
        WorkoutSyncPayload payload,
        UUID userId,
        long serverVersion
    ) {
        var exercises =
            payload.exercises()
                .stream()
                .map(exercise ->
                    new WorkoutExercise(
                        exercise.id(),
                        exercise.exerciseId(),
                        exercise.exerciseName(),
                        exercise.position(),

                        exercise.sets()
                            .stream()
                            .map(set ->
                                new WorkoutSet(
                                    set.id(),
                                    set.setNumber(),
                                    set.weightInKg(),
                                    set.reps(),
                                    set.completed()
                                )
                            )
                            .toList()
                    )
                )
                .toList();

        return new Workout(
            payload.id(),
            userId,
            payload.name(),
            payload.status(),
            payload.startedAt(),
            payload.completedAt(),
            serverVersion,
            exercises
        );
    }

    /**
     * a function for construcint the mutation acks that were applied
     * @param mutation
     * @param serverVersion
     * @return
     */
    private MutationAcknowledgement
        appliedAcknowledgement(
            SyncMutation mutation,
            long serverVersion
        ) {

        return new MutationAcknowledgement(
            mutation.mutationId(),
            mutation.aggregateType(),
            mutation.aggregateId(),
            mutation.localRevision(),
            MutationStatus.APPLIED,
            serverVersion,
            null
        );
    }
    
    /**
     *  a function for constructing the aacks that raised a coinflict
     * @param mutation
     * @param currentServerVersion
     * @return
     */
    private MutationAcknowledgement conflict(
        SyncMutation mutation,
        long currentServerVersion
    ) {
        return new MutationAcknowledgement(
            mutation.mutationId(),
            mutation.aggregateType(),
            mutation.aggregateId(),
            mutation.localRevision(),

            MutationStatus.CONFLICT,

            (Long) currentServerVersion,

            new MutationProblem(
                "server_version_mismatch",
                "The workout has changed on the server.",
                currentServerVersion
            )
        );
    }
   
    /**
     * a function for constructing the acks that were rejected
     * @param mutation
     * @param code
     * @param message
     * @return
     */
    private MutationAcknowledgement reject(
        SyncMutation mutation,
        String code,
        String message
    ) {
        return new MutationAcknowledgement(
            mutation.mutationId(),
            mutation.aggregateType(),
            mutation.aggregateId(),
            mutation.localRevision(),

            MutationStatus.REJECTED,

            null,

            new MutationProblem(
                code,
                message,
                null
            )
        );
    }
}
