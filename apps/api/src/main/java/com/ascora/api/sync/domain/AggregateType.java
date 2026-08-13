package com.ascora.api.sync.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum AggregateType {

    @JsonProperty("workout")
    WORKOUT,

    @JsonProperty("workout_plan")
    WORKOUT_PLAN
}