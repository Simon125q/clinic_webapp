package com.project.backend.repository;

import com.project.backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository  extends JpaRepository<User, Long> {
    User findById(long id);
    Optional<User> findByUsername(String username);
    Boolean existsByUsername(String username);
}

