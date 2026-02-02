package com.paki.expense_tracker.controller;

import com.paki.expense_tracker.entity.Expense;
import com.paki.expense_tracker.entity.User;
import com.paki.expense_tracker.repository.ExpenseRepository;
import com.paki.expense_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @PostMapping("/{userId}")
    public Expense addExpense(
            @PathVariable Long userId,
            @RequestBody Expense expense
    ) {
        User user = userRepository.findById(userId).orElseThrow();
        expense.setUser(user);
        return expenseRepository.save(expense);
    }

    @GetMapping("/{userId}")
    public List<Expense> getExpenses(@PathVariable Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        return expenseRepository.findByUser(user);
    }
}
