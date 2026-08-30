package com.ascora.api.sync.repository;

import java.util.Locale;
import java.util.Optional;
import java.util.UUID;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ascora.api.sync.domain.AggregateType;
import com.ascora.api.sync.domain.MutationStatus;
import com.ascora.api.sync.domain.SyncOperation;
import com.ascora.api.sync.dto.MutationAcknowledgement;
import com.ascora.api.sync.dto.MutationProblem;
import com.ascora.api.sync.dto.SyncMutation;

import lombok.RequiredArgsConstructor;

/**
 * This class if for interacting with the proccesed mutations table
 * ProcessedMutationRepository
 */
@Repository
@RequiredArgsConstructor
public class ProcessedMutationRepository {

    private final JdbcTemplate jdbc;

    // public ProcessedMutationRepository(
    //     JdbcTemplate jdbc
    // ) {
    //     this.jdbc = jdbc;
    // }

    /**
     * this function is for attempting to clim the proccessing right for a user's mutation
     * @param userId
     * @param deviceId
     * @param mutation
     * @return
     */
    public boolean tryClaim(
        UUID userId,
        String deviceId,
        SyncMutation mutation
    ) {
        int inserted = jdbc.update(
            """
            INSERT INTO processed_client_mutations (
                mutation_id,
                user_id,
                device_id,
                aggregate_type,
                aggregate_id,
                operation,
                local_revision,
                base_server_version,
                status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'processing')
            ON CONFLICT (mutation_id) DO NOTHING
            """,
            mutation.mutationId(),
            userId,
            deviceId,
            toDbValue(mutation.aggregateType()),
            mutation.aggregateId(),
            toDbValue(mutation.operation()),
            mutation.localRevision(),
            mutation.baseServerVersion()
        );

        return inserted == 1;
    }

    /**
     * this function is for marking a mutation as completed
     * @param userId
     * @param mutationId
     * @param acknowledgement
     */
    public void complete(
        UUID userId,
        UUID mutationId,
        MutationAcknowledgement acknowledgement
    ) {
        int updated = jdbc.update(
            """
            UPDATE processed_client_mutations
            SET
                status = ?,
                resulting_server_version = ?,
                problem_code = ?,
                problem_message = ?,
                processed_at = now()
            WHERE mutation_id = ?
            AND user_id = ?
            AND status = 'processing'
            """,
            toDbValue(acknowledgement.status()),
            acknowledgement.serverVersion(),

            acknowledgement.problem() != null
                ? acknowledgement.problem().code()
                : null,

            acknowledgement.problem() != null
                ? acknowledgement.problem().message()
                : null,

            mutationId,
            userId
        );

        if (updated != 1) {
            throw new IllegalStateException(
                "Could not complete processed mutation: "
                    + mutationId
            );
        }
    }

    /**
     * this function is meant to seek an already proccesed mutation
     * @param userId
     * @param mutationId
     * @return
     */
    public Optional<MutationAcknowledgement>
        findAcknowledgement(
            UUID userId,
            UUID mutationId
        ) {

        var results = jdbc.query(
            """
            SELECT
                mutation_id,
                aggregate_type,
                aggregate_id,
                local_revision,
                status,
                resulting_server_version,
                problem_code,
                problem_message
            FROM processed_client_mutations
            WHERE mutation_id = ?
            AND user_id = ?
            AND status <> 'processing'
            """,
            (rs, rowNum) -> {
                MutationStatus status =
                    parseStatus(
                        rs.getString("status")
                    );

                Long serverVersion =
                    rs.getObject(
                        "resulting_server_version",
                        Long.class
                    );

                String problemCode =
                    rs.getString("problem_code");

                String problemMessage =
                    rs.getString("problem_message");

                MutationProblem problem =
                    problemCode == null
                        ? null
                        : new MutationProblem(
                            problemCode,
                            problemMessage,

                            status ==
                                MutationStatus.CONFLICT
                                ? serverVersion
                                : null
                        );

                return new MutationAcknowledgement(
                    rs.getObject(
                        "mutation_id",
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

                    rs.getLong(
                        "local_revision"
                    ),

                    status,
                    serverVersion,
                    problem
                );
            },
            mutationId,
            userId
        );

        return results.stream().findFirst();
    }

    /**
     * helper function for translating aggeragaet types to the expected db shape
     * @param type
     * @return
     */
    private String toDbValue(
        AggregateType type
    ) {
        return type
            .name()
            .toLowerCase(Locale.ROOT);
    }

    /**
     * helper function for translating operation types to the expected db shape
     * @param operation
     * @return
     */
    private String toDbValue(
        SyncOperation operation
    ) {
        return operation
            .name()
            .toLowerCase(Locale.ROOT);
    }

    /**
     * helper function for trasnlating a status type into the excepted db shape
     * @param status
     * @return
     */
    private String toDbValue(
        MutationStatus status
    ) {
        return status
            .name()
            .toLowerCase(Locale.ROOT);
    }

    /**
     * a helper function 
     * @param value
     * @return
     */
    private AggregateType parseAggregateType(
        String value
    ) {
        return AggregateType.valueOf(
            value.toUpperCase(Locale.ROOT)
        );
    }

    /**
     * look at that! another helper function...
     * @param value
     * @return
     */
    private MutationStatus parseStatus(
        String value
    ) {
        return MutationStatus.valueOf(
            value.toUpperCase(Locale.ROOT)
        );
    }
}
