package com.ascora.api.insights.service;

import java.time.OffsetDateTime;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.ascora.api.analysis.dto.WorkoutSummaryInsightData;
import com.ascora.api.insights.dto.Insight;
import com.ascora.api.insights.dto.InsightSyncPayload;
import com.ascora.api.insights.repository.InsightRepository;
import com.ascora.api.sync.domain.AggregateType;
import com.ascora.api.sync.repository.SyncChangeRepository;

import lombok.RequiredArgsConstructor;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

@Service
@RequiredArgsConstructor
public class InsightService {
    private final InsightRepository insightRepository;
    private final SyncChangeRepository syncChangeRepository;
    private final ObjectMapper objectMapper;

    @Transactional
    public void createWorkoutSummary(
        UUID jobId,
        UUID userId, 
        UUID workoutId, 
        WorkoutSummaryInsightData analysis
    ) {
        UUID insightId = UUID.randomUUID();
        
        JsonNode analysisData = objectMapper.valueToTree(analysis);

        Insight insight = new Insight(
            insightId, 
            userId, 
            jobId,
            workoutId, 
            "workout", 
            "workout_summary",
            "Workout complete",
            "You completed "
                + analysis.completedSets()
                + " sets with "
                + analysis.totalVolumeKg()
                + " kg of total volume.",
            analysisData, 
            OffsetDateTime.now()
        );

        boolean inserted = insightRepository.insert(insight);

        if (!inserted) {
            return;
        }

        InsightSyncPayload syncPayload = 
            new InsightSyncPayload(
                insight.sourceAggregateId(), 
                insight.sourceAggregateType(), 
                insight.insightType(), 
                insight.title(), 
                insight.message(),
                insight.data(), 
                insight.createdAt()
            );

        JsonNode syncData = objectMapper.valueToTree(syncPayload);

        syncChangeRepository.insertServerGeneratedUpsert(
            userId, 
            insightId, 
            AggregateType.INSIGHT, 
            1, 
            syncData
        );
    }
}
