package com.ascora.api.sync.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ascora.api.security.CurrentUserResolver;
import com.ascora.api.sync.dto.SyncRequest;
import com.ascora.api.sync.dto.SyncResponse;
import com.ascora.api.sync.service.SyncService;

import jakarta.validation.Valid;
// import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/sync")
public class SyncController {

    private final SyncService syncService;
    private final CurrentUserResolver currentUserResolver;

    public SyncController(
        SyncService syncService,
        CurrentUserResolver currentUserResolver
    ) {
        this.syncService =
            syncService;

        this.currentUserResolver =
            currentUserResolver;
    }

    @PostMapping
    public SyncResponse sync(
        @AuthenticationPrincipal Jwt jwt,
        @Valid @RequestBody SyncRequest request
    ) {
        var user =
            currentUserResolver.requireUser(jwt);

        return syncService.sync(
            user.getId(),
            request
        );
    }
}