package com.ascora.api.sync.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

// a helper for the requested operation
public enum SyncOperation {

    @JsonProperty("upsert")
    UPSERT,

    @JsonProperty("delete")
    DELETE
}