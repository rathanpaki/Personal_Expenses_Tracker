package com.paki.expense_tracker.repository;

import com.paki.expense_tracker.entity.Budget;
import com.paki.expense_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface BudgetRepository extends JpaRepository<Budget, Long> {
    // Fetch budgets for a specific user
    List<Budget> findByUser(User user);
    // Fetch a budget by user and category
    Optional<Budget> findByUserAndCategory(User user, String category);
}
