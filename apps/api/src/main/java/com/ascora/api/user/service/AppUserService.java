package com.ascora.api.user.service;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;

import com.ascora.api.user.dto.AppUserResponse;
import com.ascora.api.user.model.AppUser;
import com.ascora.api.user.repository.AppUserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AppUserService  {
    private final AppUserRepository appUserRepository;
    
    public AppUserResponse findOrCreateFromJwt(Jwt jwt) {
        String authSubject = jwt.getSubject();
        String email = jwt.getClaimAsString("email");
        String fullName = jwt.getClaimAsString("name");

        if (authSubject == null || authSubject.isBlank()) {
            throw new IllegalStateException("Authenticated token is missing its subject");
        }

        AppUser user = appUserRepository
            .findByAuthSubject(authSubject)
            .orElseGet(() -> {
                AppUser newUser = AppUser.create(
                    authSubject,
                    fullName,
                    email,
                    null
                );

            return appUserRepository.save(newUser);
        });

        return AppUserResponse.from(user);

    }
}
