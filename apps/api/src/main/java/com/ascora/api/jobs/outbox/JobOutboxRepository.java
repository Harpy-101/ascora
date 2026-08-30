package com.ascora.api.jobs.outbox;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ascora.api.sync.domain.AggregateType;

import lombok.RequiredArgsConstructor;
import tools.jackson.core.JacksonException;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/**
 * a repo for the job outbox 
 * JobOutboxRepository
 */
@Repository
@RequiredArgsConstructor
public class JobOutboxRepository {
    private final JdbcTemplate jdbc;
    private final ObjectMapper objectMapper; 

    /**
     * a fucntion for inserting a new job
     * @param job
     */
    public void insert(
        JobOutboxRecord job
    ) {
        jdbc.update(
            """
            INSERT INTO job_outbox (
                id,
                job_type,
                aggregate_type,
                aggregate_id,
                payload
            )
            VALUES (?, ?, ?, ?, ?::jsonb)
            """,
            job.id(),
            job.jobType(),
            job.aggregateType()
                .name()
                .toLowerCase(Locale.ROOT),
            job.aggregateId(),
            job.payload().toString()
        );
    }

    /**
     * a function for finding the pending jobs
     * @return
     */
    public List<JobOutboxRecord> findPending() {
        return jdbc.query(
            """
            SELECT
                id,
                aggregate_id,
                aggregate_type,
                job_type,
                payload
            FROM job_outbox
            WHERE published_at IS NULL
            ORDER BY created_at
            LIMIT 50
            """,
            (rs, rowNum) -> {
                try {
                    JsonNode payload =
                        objectMapper.readTree(
                            rs.getString("payload")
                        );

                    return new JobOutboxRecord(
                        rs.getObject(
                            "id",
                            UUID.class
                        ),

                        rs.getObject(
                            "aggregate_id",
                            UUID.class
                        ),

                        AggregateType.valueOf(
                            rs.getString(
                                "aggregate_type"
                            ).toUpperCase(
                                Locale.ROOT
                            )
                        ),

                        rs.getString("job_type"),

                        payload
                    );
                } catch (JacksonException e) {
                    throw new IllegalStateException(
                        "Invalid JSON stored in job outbox",
                        e
                    );
                }
            }
        );
    }

    /**
     * a function for marking a particular job as published 
     * @param jobId
     */
    public void makePublished(UUID jobId) {
        jdbc.update(
            """
            UPDATE job_outbox
            SET published_at = now()
            WHERE id = ?
            """, 
            jobId
        );
    }

    /**
     * a function for error tracking
     * @param jobId
     * @param error
     */
    public void recordFailure(UUID jobId, String error) {
        jdbc.update(
            """
            UPDATE job_outbox
            SET last_error = ?
            WHERE id = ?
            """, 
            error,
            jobId
        );
    }
}
