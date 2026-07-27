package com.ascora.api.user.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.ascora.api.user.dto.AppUserResponse;
import com.ascora.api.user.service.AppUserService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/me")
@RequiredArgsConstructor
public class CurrentUserController {
    private final AppUserService appUserService;

    // @GetMapping("/api/me")
    // public CurrentUserResponse getCurrentUser(
    //     @AuthenticationPrincipal Jwt jwt
    // ) {
    //     return new CurrentUserResponse(
    //         jwt.getSubject(),
    //         jwt.getClaimAsString("email"),
    //         jwt.getClaimAsString("name")
    //     );
    // }

    @PostMapping("/bootstrap")
    public AppUserResponse bootstrapUser(
        @AuthenticationPrincipal Jwt jwt
    ) {
        return appUserService.findOrCreateFromJwt(jwt);
    }
}
