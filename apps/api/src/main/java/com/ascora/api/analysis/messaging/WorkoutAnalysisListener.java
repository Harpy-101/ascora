package com.ascora.api.analysis.messaging;

import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import com.ascora.api.analysis.worker.WorkoutAnalysisWorker;
import com.ascora.api.jobs.messaging.JmsDestinations;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class WorkoutAnalysisListener {
    private final WorkoutAnalysisWorker worker;

    @JmsListener(destination = JmsDestinations.WORKOUT_ANALYSIS)
    public void receive(WorkoutAnalysisJob job) {
        worker.process(job);
    }
}
