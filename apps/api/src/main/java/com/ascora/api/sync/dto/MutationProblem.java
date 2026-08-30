package com.ascora.api.sync.dto;

// an object noting a problem witha current mutation
public record MutationProblem(
    String code,
    String message,
    Long currentServerVersion
) {}