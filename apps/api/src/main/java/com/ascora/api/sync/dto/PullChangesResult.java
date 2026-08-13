package com.ascora.api.sync.dto;

import java.util.List;

public record PullChangesResult(
    List<SyncChange> changes,
    String nextCursor,
    boolean hasMore
) {}