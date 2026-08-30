package com.ascora.api.sync.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ascora.api.sync.applier.WorkoutSyncApplier;
import com.ascora.api.sync.dto.MutationAcknowledgement;
import com.ascora.api.sync.dto.SyncMutation;
import com.ascora.api.sync.dto.SyncRequest;
import com.ascora.api.sync.dto.SyncResponse;

import lombok.RequiredArgsConstructor;

/**
 * a class for the sync service
 * SyncService
 */
@RequiredArgsConstructor
@Service
public class SyncService {

    private static final int PULL_LIMIT = 100;

    private final WorkoutSyncApplier workoutSyncApplier;
    private final PullChangesService pullChangesService;

    // public SyncService(
    //     WorkoutSyncApplier workoutSyncApplier,
    //     PullChangesService pullChangesService
    // ) {
    //     this.workoutSyncApplier =
    //         workoutSyncApplier;

    //     this.pullChangesService =
    //         pullChangesService;
    // }

    /**
     * the actual sync function
     * @param userId
     * @param request
     * @return
     */
    public SyncResponse sync(
        UUID userId,
        SyncRequest request
    ) {
        List<MutationAcknowledgement> acknowledgements =
            new ArrayList<>();

        for (SyncMutation mutation : request.mutations()) {

            MutationAcknowledgement acknowledgement =
                applyMutation(
                    userId,
                    request.deviceId(),
                    mutation
                );

            acknowledgements.add(
                acknowledgement
            );
        }

        var pullResult =
            pullChangesService.pull(
                userId,
                request.cursor(),
                PULL_LIMIT
            );

        return new SyncResponse(
            acknowledgements,
            pullResult.changes(),
            pullResult.nextCursor(),
            pullResult.hasMore()
        );
    }

    /**
     * a function for syncing the users db to the remote db (by applying the changhes )
     * @param userId
     * @param deviceId
     * @param mutation
     * @return
     */
    private MutationAcknowledgement applyMutation(
        UUID userId,
        String deviceId,
        SyncMutation mutation
    ) {
        return switch (mutation.aggregateType()) {
            case WORKOUT ->
                workoutSyncApplier.apply(
                    userId,
                    deviceId,
                    mutation
                );

            case WORKOUT_PLAN ->
                throw new UnsupportedOperationException(
                    "Workout plan sync is not implemented yet."
                );
            
            case INSIGHT -> 
                throw new UnsupportedOperationException(
                    "Insight sync is not implemented yet"
                );
        };
    }
}