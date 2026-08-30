package com.ascora.api.user.repository;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.repository.CrudRepository;

import com.ascora.api.user.model.AppUser;

// a repo that I wouldv'e written differently 
public interface AppUserRepository extends CrudRepository<AppUser, UUID> {
    Optional<AppUser> findByAuthSubject(String authSubject);
}
