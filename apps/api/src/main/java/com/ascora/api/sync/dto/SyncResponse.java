package com.ascora.api.sync.dto;

import java.util.List;


public record SyncResponse(
    List<MutationAcknowledgement> acknowledgements,
    List<SyncChange> changes,
    String nextCursor,
    boolean hasMore
) {}