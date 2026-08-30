package com.ascora.api.analysis.messaging;

import org.springframework.jms.annotation.JmsListener;
import org.springframework.stereotype.Component;

import com.ascora.api.analysis.worker.WorkoutAnalysisWorker;
import com.ascora.api.jobs.messaging.JmsDestinations;

import lombok.RequiredArgsConstructor;

/**
 * a listiner for the workout anaylisis worker to recive jms messages
 * WorkoutAnalysisListener
 */
@Component
@RequiredArgsConstructor
public class WorkoutAnalysisListener {
    private final WorkoutAnalysisWorker worker;

    /**
     * there isn't really much to say here
     * @param job the jobs data
     */
    @JmsListener(destination = JmsDestinations.WORKOUT_ANALYSIS)
    public void receive(WorkoutAnalysisJob job) {
        worker.process(job);
    }
}
