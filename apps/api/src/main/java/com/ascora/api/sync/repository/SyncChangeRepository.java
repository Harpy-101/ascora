package com.ascora.api.sync.repository;

import org.springframework.stereotype.Repository;

import com.ascora.api.sync.domain.AggregateType;
import com.ascora.api.sync.domain.SyncOperation;
import com.ascora.api.sync.dto.SyncChangeRecord;

import tools.jackson.databind.JsonNode;

import java.util.List;
import java.util.UUID;

import org.springframework.jdbc.core.JdbcTemplate;


@Repository
public class SyncChangeRepository {

    private final JdbcTemplate jdbc;

    public SyncChangeRepository(
        JdbcTemplate jdbc
    ) {
        this.jdbc = jdbc;
    }

    public long insertUpsert(
        UUID userId,
        UUID aggregateId,
        AggregateType aggregateType,
        long serverVersion,
        UUID mutationId,
        String deviceId,
        JsonNode payload
    ) {
        long userSequence =
            nextUserSequence(userId);

        String json = payload.toString();

        Long insertedSequence =
            jdbc.queryForObject(
                """
                INSERT INTO sync_changes (
                    user_id,
                    user_sequence,
                    aggregate_type,
                    aggregate_id,
                    operation,
                    server_version,
                    mutation_id,
                    origin_device_id,
                    payload
                )
                VALUES (
                    ?,
                    ?,
                    ?,
                    ?,
                    'upsert',
                    ?,
                    ?,
                    ?,
                    ?::jsonb
                )
                RETURNING user_sequence
                """,
                Long.class,
                userId,
                userSequence,
                toDbValue(aggregateType),
                aggregateId,
                serverVersion,
                mutationId,
                deviceId,
                json
            );

        if (insertedSequence == null) {
            throw new IllegalStateException(
                "Could not create sync change"
            );
        }

        return insertedSequence;
    }
 
    public long insertDelete(
        UUID userId,
        UUID aggregateId,
        AggregateType aggregateType,
        long serverVersion,
        UUID mutationId,
        String deviceId
    ) {
        long userSequence =
            nextUserSequence(userId);

        Long insertedSequence =
            jdbc.queryForObject(
                """
                INSERT INTO sync_changes (
                    user_id,
                    user_sequence,
                    aggregate_type,
                    aggregate_id,
                    operation,
                    server_version,
                    mutation_id,
                    origin_device_id,
                    payload
                )
                VALUES (
                    ?,
                    ?,
                    ?,
                    ?,
                    'delete',
                    ?,
                    ?,
                    ?,
                    NULL
                )
                RETURNING user_sequence
                """,
                Long.class,
                userId,
                userSequence,
                toDbValue(aggregateType),
                aggregateId,
                serverVersion,
                mutationId,
                deviceId
            );

        if (insertedSequence == null) {
            throw new IllegalStateException(
                "Could not create sync change"
            );
        }

        return insertedSequence;
    }


    private String toDbValue(
        AggregateType type
    ) {
        return switch (type) {
            case WORKOUT -> "workout";
            case WORKOUT_PLAN -> "workout_plan";
            case INSIGHT -> "insight";
        };
    }

    public List<SyncChangeRecord> findAfter(
        UUID userId,
        long cursor,
        int limit
    ) {
        return jdbc.query(
            """
            SELECT
                user_sequence,
                user_id,
                aggregate_type,
                aggregate_id,
                operation,
                server_version,
                mutation_id,
                origin_device_id,
                payload
            FROM sync_changes
            WHERE user_id = ?
            AND user_sequence > ?
            ORDER BY user_sequence
            LIMIT ?
            """,
            (rs, rowNum) ->
                new SyncChangeRecord(
                    rs.getLong(
                        "user_sequence"
                    ),

                    rs.getObject(
                        "user_id",
                        UUID.class
                    ),

                    parseAggregateType(
                        rs.getString(
                            "aggregate_type"
                        )
                    ),

                    rs.getObject(
                        "aggregate_id",
                        UUID.class
                    ),

                    parseOperation(
                        rs.getString(
                            "operation"
                        )
                    ),

                    rs.getLong(
                        "server_version"
                    ),

                    rs.getObject(
                        "mutation_id",
                        UUID.class
                    ),

                    rs.getString(
                        "origin_device_id"
                    ),

                    rs.getString(
                        "payload"
                    )
                ),
            userId,
            cursor,
            limit
        );
    }

    private AggregateType parseAggregateType(
        String value
    ) {
        return switch (value) {
            case "workout" ->
                AggregateType.WORKOUT;

            case "workout_plan" ->
                AggregateType.WORKOUT_PLAN;

            case "insight" -> 
                AggregateType.INSIGHT;

            default ->
                throw new IllegalStateException(
                    "Unknown aggregate type: "
                        + value
                );
        };
    }

    private SyncOperation parseOperation(
        String value
    ) {
        return switch (value) {
            case "upsert" ->
                SyncOperation.UPSERT;

            case "delete" ->
                SyncOperation.DELETE;

            default ->
                throw new IllegalStateException(
                    "Unknown sync operation: "
                        + value
                );
        };
    }

    private long nextUserSequence(UUID userId) {
        Long sequence = jdbc.queryForObject(
            """
            INSERT INTO user_sync_stream (
                user_id,
                current_sequence,
                pruned_through
            )
            VALUES (?, 1, 0)

            ON CONFLICT (user_id)
            DO UPDATE
            SET current_sequence =
                user_sync_stream.current_sequence + 1

            RETURNING current_sequence
            """,
            Long.class,
            userId
        );

        if (sequence == null) {
            throw new IllegalStateException(
                "Could not allocate sync sequence"
            );
        }

        return sequence;
    }

    public long insertServerGeneratedUpsert(
        UUID userId,
        UUID aggregateId,
        AggregateType aggregateType,
        long serverVersion,
        JsonNode payload
    ) {
        return insertUpsert(
            userId,
            aggregateId,
            aggregateType,
            serverVersion,
            null,
            null,
            payload
        );
    }
}