package com.paki.expense_tracker.controller;

import com.paki.expense_tracker.entity.Budget;
import com.paki.expense_tracker.entity.Expense;
import com.paki.expense_tracker.entity.User;
import com.paki.expense_tracker.repository.BudgetRepository;
import com.paki.expense_tracker.repository.ExpenseRepository;
import com.paki.expense_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/budgets")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BudgetController {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    @PostMapping("/{userId}")
    public ResponseEntity<Budget> setBudget(
            @PathVariable Long userId,
            @RequestBody Budget budget
    ) {
                // Find the user owning this budget
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
                // Update existing budget for the same category if present
        Optional<Budget> existing = budgetRepository.findByUserAndCategory(user, budget.getCategory());
        if (existing.isPresent()) {
            Budget existingBudget = existing.get();
            existingBudget.setAmount(budget.getAmount());
            return ResponseEntity.ok(budgetRepository.save(existingBudget));
        }
        
                // Create a new budget for this user and category
        budget.setUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(budgetRepository.save(budget));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Budget>> getBudgets(@PathVariable Long userId) {
                // Return all budgets for a user
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Budget> budgets = budgetRepository.findByUser(user);
        return ResponseEntity.ok(budgets);
    }

    @GetMapping("/{userId}/with-spending")
    public ResponseEntity<List<Map<String, Object>>> getBudgetsWithSpending(@PathVariable Long userId) {
        // Enrich budgets with spending totals and derived stats
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<Budget> budgets = budgetRepository.findByUser(user);
        List<Expense> expenses = expenseRepository.findByUser(user);
        
        List<Map<String, Object>> response = budgets.stream()
                .map(budget -> {
                    Map<String, Object> data = new HashMap<>();
                    double spent = expenses.stream()
                            .filter(e -> e.getCategory().equals(budget.getCategory()))
                            .mapToDouble(Expense::getAmount)
                            .sum();
                    
                    data.put("id", budget.getId());
                    data.put("category", budget.getCategory());
                    data.put("amount", budget.getAmount());
                    data.put("spent", spent);
                    data.put("remaining", budget.getAmount() - spent);
                    data.put("percentage", (spent / budget.getAmount()) * 100);
                    
                    return data;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/{budgetId}")
    public ResponseEntity<Budget> updateBudget(
            @PathVariable Long userId,
            @PathVariable Long budgetId,
            @RequestBody Budget budgetDetails
    ) {
        // Ensure budget belongs to the user before updating
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (!budget.getUser().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        budget.setAmount(budgetDetails.getAmount());
        return ResponseEntity.ok(budgetRepository.save(budget));
    }

    @DeleteMapping("/{userId}/{budgetId}")
    public ResponseEntity<Void> deleteBudget(
            @PathVariable Long userId,
            @PathVariable Long budgetId
    ) {
        // Ensure budget belongs to the user before deleting
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Budget budget = budgetRepository.findById(budgetId)
                .orElseThrow(() -> new RuntimeException("Budget not found"));
        
        if (!budget.getUser().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        budgetRepository.delete(budget);
        return ResponseEntity.noContent().build();
    }
}
