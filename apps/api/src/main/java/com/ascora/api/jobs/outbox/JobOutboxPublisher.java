package com.ascora.api.jobs.outbox;

import org.springframework.jms.core.JmsTemplate;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.ascora.api.analysis.messaging.WorkoutAnalysisJob;
import com.ascora.api.jobs.messaging.JmsDestinations;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class JobOutboxPublisher {
    private final JobOutboxRepository jobOutboxRepository;
    private final JmsTemplate jmsTemplate;

    @Scheduled(fixedDelay = 2000)
    public void publishPending() {
        var jobs = jobOutboxRepository.findPending();

        for (var job : jobs) {
            try {

                var message = new WorkoutAnalysisJob(job.id(), job.aggregateId());

                jmsTemplate.convertAndSend(
                    JmsDestinations.WORKOUT_ANALYSIS, 
                    message
                );

                jobOutboxRepository.makePublished(job.id());
            } catch (Exception e) {
                jobOutboxRepository.recordFailure(job.id(), e.getMessage());
            }
        }
    }
}
