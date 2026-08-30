package com.ascora.api.insights.repository;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import com.ascora.api.insights.dto.Insight;

import lombok.RequiredArgsConstructor;

/**
 * a repo fo facilitating the interaction with the insights table
 * InsightRepository
 */
@Repository
@RequiredArgsConstructor
public class InsightRepository {
    private final JdbcTemplate jdbc;

    /**
     * a function for inserting a new insight
     * @param insight 
     * @return
     */
    public boolean insert(Insight insight) {
        int inserted = jdbc.update(
            """
            INSERT INTO insights (
                id,
                user_id,
                source_job_id,
                source_aggregate_id,
                source_aggregate_type,
                insight_type,
                title,
                message,
                data, 
                created_at
            )
            VALUES (
                ?, ?, ?, ?, ?, ?, ?, ?, ?::jsonb, ?
            )
            ON CONFLICT (source_job_id, insight_type)
            WHERE source_job_id IS NOT NULL
            DO NOTHING 
            """,
            insight.id(),
            insight.userId(),
            insight.sourceJobId(),
            insight.sourceAggregateId(),
            insight.sourceAggregateType(),
            insight.insightType(),
            insight.title(),
            insight.message(),
            insight.data() != null
                ? insight.data().toString()
                : null, 
            insight.createdAt()
        );

        return inserted == 1;
    }
}
