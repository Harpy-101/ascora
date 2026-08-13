package com.ascora.api.sync.dto;


public record MutationProblem(
    String code,
    String message,
    Long currentServerVersion
) {}