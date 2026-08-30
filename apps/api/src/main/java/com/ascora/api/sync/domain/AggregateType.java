package com.ascora.api.sync.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

// a helper for aggreegate typers
public enum AggregateType {

    @JsonProperty("workout")
    WORKOUT,

    @JsonProperty("workout_plan")
    WORKOUT_PLAN,

    @JsonProperty("insight")
    INSIGHT
}