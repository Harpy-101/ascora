package com.ascora.api.sync.dto;

import java.util.List;

// an object represnting the chnages made on the server
public record PullChangesResult(
    List<SyncChange> changes,
    String nextCursor,
    boolean hasMore
) {}