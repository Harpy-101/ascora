package com.ascora.api.sync.service;

import java.util.UUID;

import org.springframework.stereotype.Service;

import com.ascora.api.sync.dto.PullChangesResult;
import com.ascora.api.sync.dto.SyncChange;
import com.ascora.api.sync.dto.SyncChangeRecord;
import com.ascora.api.sync.repository.SyncChangeRepository;

import lombok.RequiredArgsConstructor;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * a class for the pull changes service 
 * PullChangesService
 */
@Service
@RequiredArgsConstructor
public class PullChangesService {
   
    private final SyncChangeRepository syncChangeRepository;
    private final ObjectMapper objectMapper;

    // public PullChangesService(
    //     SyncChangeRepository syncChangeRepository,
    //     ObjectMapper objectMapper
    // ) {
    //     this.syncChangeRepository =
    //         syncChangeRepository;

    //     this.objectMapper =
    //         objectMapper;
    // }

    /**
     * the actual function meant for pulling changes the user should know about
     * @param userId
     * @param cursor
     * @param limit
     * @return
     */
    public PullChangesResult pull(
        UUID userId,
        String cursor,
        int limit
    ) {
        long sequence =
            parseCursor(cursor);

        /*
         * Fetching one extra row so can know whether
         * another page exists.
         */
        var rows =
            syncChangeRepository.findAfter(
                userId,
                sequence,
                limit + 1
            );

        boolean hasMore =
            rows.size() > limit;

        var page =
            hasMore
                ? rows.subList(0, limit)
                : rows;

        var changes =
            page.stream()
                .map(this::toSyncChange)
                .toList();

        String nextCursor =
            page.isEmpty()
                ? Long.toString(sequence)
                : Long.toString(
                    page.get(
                        page.size() - 1
                    ).userSequence()
                );

        return new PullChangesResult(
            changes,
            nextCursor,
            hasMore
        );
    }

    /**
     * a function for detrminin the users currsor in order to figure out from which point to include the changes
     * @param cursor
     * @return
     */
    private long parseCursor(
        String cursor
    ) {
        if (
            cursor == null ||
            cursor.isBlank()
        ) {
            return 0L;
        }

        try {
            return Long.parseLong(cursor);
        } catch (NumberFormatException e) {
            throw new IllegalArgumentException(
                "Invalid sync cursor."
            );
        }
    }

    // a fuinction for preparing the changes to passed in the corrct format
    private SyncChange toSyncChange(
        SyncChangeRecord row
    ) {
        JsonNode payload = null;

        if (row.payload() != null) {
            try {
                payload =
                    objectMapper.readTree(
                        row.payload()
                    );
            } catch (JacksonException e) {
                throw new IllegalStateException(
                    "Invalid JSON stored in sync_changes",
                    e
                );
            }
        }

        return new SyncChange(
            Long.toString(row.userSequence()),
            row.aggregateType(),
            row.aggregateId(),
            row.operation(),
            row.serverVersion(),
            payload
        );
    } 
}
