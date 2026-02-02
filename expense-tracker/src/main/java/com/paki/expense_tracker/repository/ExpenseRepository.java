package com.paki.expense_tracker.repository;

import com.paki.expense_tracker.entity.Expense;
import com.paki.expense_tracker.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {
    List<Expense> findByUser(User user);
}
