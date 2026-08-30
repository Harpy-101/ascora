package com.ascora.api.user.dto;

import java.time.Instant;
import java.util.UUID;

import com.ascora.api.user.model.AppUser;

// an object for representing a user for furthed user thoughout the server
public record AppUserResponse(
    UUID id,
    String authSubject,
    String fullName,
    String displayName,
    String email,
    String avatarUrl,
    Instant createdAt,
    Instant updatedAt
) {

    public static AppUserResponse from(AppUser user) {
        return new AppUserResponse(
            user.getId(),
            user.getAuthSubject(),
            user.getFullName(),
            user.getDisplayName(),
            user.getEmail(),
            user.getAvatarUrl(),
            user.getCreatedAt(),
            user.getUpdatedAt()
        );
    }
}