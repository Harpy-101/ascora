package com.ascora.api.sync.domain;

import com.fasterxml.jackson.annotation.JsonProperty;

public enum SyncOperation {

    @JsonProperty("upsert")
    UPSERT,

    @JsonProperty("delete")
    DELETE
}