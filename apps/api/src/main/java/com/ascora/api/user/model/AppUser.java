package com.ascora.api.user.model;

import java.time.Instant;
import java.util.UUID;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Version;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table("app_users")
public class AppUser  {
    @Id
    private UUID id;

    @Column("auth_subject")
    private String authSubject;

    @Column("full_name")
    private String fullName;

    @Column("display_name")
    private String displayName;

    private String email;

    @Column("avatar_url")
    private String avatarUrl;

    @Column("created_at")
    private Instant createdAt;

    @Column("updated_at")
    private Instant updatedAt;

    @Version
    private Long version;

    public AppUser(
        UUID id,
        String authSubject,
        String fullName,
        String displayName,
        String email,
        String avatarUrl,
        Instant createdAt,
        Instant updatedAt,
        Long version
    ) {
        this.id = id;
        this.authSubject = authSubject;
        this.fullName = fullName;
        this.displayName = displayName;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.version = version;
    }

    public static AppUser create(
        String authSubject, 
        String fullName, 
        String email, 
        String avatarUrl
    ) {
        Instant now = Instant.now();

        return new AppUser(
            UUID.randomUUID(), 
            authSubject, 
            fullName, 
            fullName, 
            email, 
            avatarUrl, 
            now, 
            now, 
            null
        );
    }

    public void updateProfile(
        String fullName, 
        String email, 
        String avatarUrl
    ) {
        this.fullName = fullName;
        this.email = email;
        this.avatarUrl = avatarUrl;
        this.updatedAt = Instant.now();
    }

     public UUID getId() {
        return id;
    }

    public String getAuthSubject() {
        return authSubject;
    }

    public String getFullName() {
        return fullName;
    }

    public String getDisplayName() {
        return displayName;
    }

    public String getEmail() {
        return email;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public Long getVersion() {
        return version;
    }
}
