package com.ascora.api.sync.dto;

import java.util.List;

// the sync process result as the mobile app expects torecive 
public record SyncResponse(
    List<MutationAcknowledgement> acknowledgements,
    List<SyncChange> changes,
    String nextCursor,
    boolean hasMore
) {}