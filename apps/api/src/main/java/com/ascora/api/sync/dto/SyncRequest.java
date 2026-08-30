package com.ascora.api.sync.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

// the users requested sync payload
public record SyncRequest(
    @NotBlank
    String deviceId,
    String cursor,

    @NotNull
    @Size(max = 100)
    List<@Valid SyncMutation> mutations

) {}