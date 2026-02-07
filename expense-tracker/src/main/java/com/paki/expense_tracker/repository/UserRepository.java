package com.paki.expense_tracker.repository;

import com.paki.expense_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Find a user by email address
    Optional<User> findByEmail(String email);
}
