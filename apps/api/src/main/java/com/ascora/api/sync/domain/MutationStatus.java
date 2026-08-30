package com.ascora.api.sync.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

// a helper for mutations statuss
public enum MutationStatus {

    @JsonProperty("applied")
    APPLIED,

    @JsonProperty("conflict")
    CONFLICT,

    @JsonProperty("rejected")
    REJECTED
}