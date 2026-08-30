package com.ascora.api.security;

import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;

import com.ascora.api.user.model.AppUser;
import com.ascora.api.user.repository.AppUserRepository;

import lombok.RequiredArgsConstructor;

/**
 * a class for faciliting user auth checks
 * CurrentUserResolver
 */
@Component
@RequiredArgsConstructor
public class CurrentUserResolver {
    private final AppUserRepository userRepository;

    /**
     * a function for checking the users authsubject (created by better auth) in order to gfigure out who is the actual user
     * @param jwt
     * @return
     */
    public AppUser requireUser(Jwt jwt) {
        String authSubject = jwt.getSubject();
        if (authSubject == null || authSubject.isBlank()) {
            throw new BadCredentialsException("Toekn is missing subject");
        }

        return userRepository
            .findByAuthSubject(authSubject)
            .orElseThrow(() -> 
                new UsernameNotFoundException("Authenticated user was not found")
        );
    }
}
