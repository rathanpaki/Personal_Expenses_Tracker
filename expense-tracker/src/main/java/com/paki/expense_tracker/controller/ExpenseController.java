package com.paki.expense_tracker.controller;

import com.paki.expense_tracker.entity.Expense;
import com.paki.expense_tracker.entity.User;
import com.paki.expense_tracker.repository.ExpenseRepository;
import com.paki.expense_tracker.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/expenses")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ExpenseController {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    @PostMapping("/{userId}")
    public ResponseEntity<Expense> addExpense(
            @PathVariable Long userId,
            @RequestBody Expense expense
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        expense.setUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(expenseRepository.save(expense));
    }

    @GetMapping("/{userId}")
    public ResponseEntity<List<Expense>> getExpenses(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Expense> expenses = expenseRepository.findByUser(user);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{userId}/all")
    public ResponseEntity<List<Expense>> getAllExpenses(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Expense> expenses = expenseRepository.findByUser(user);
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{userId}/by-category/{category}")
    public ResponseEntity<List<Expense>> getExpensesByCategory(
            @PathVariable Long userId,
            @PathVariable String category
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Expense> expenses = expenseRepository.findByUser(user)
                .stream()
                .filter(e -> e.getCategory().equalsIgnoreCase(category))
                .collect(Collectors.toList());
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{userId}/date-range")
    public ResponseEntity<List<Expense>> getExpensesByDateRange(
            @PathVariable Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Expense> expenses = expenseRepository.findByUser(user)
                .stream()
                .filter(e -> !e.getDate().isBefore(startDate) && !e.getDate().isAfter(endDate))
                .collect(Collectors.toList());
        return ResponseEntity.ok(expenses);
    }

    @GetMapping("/{userId}/total")
    public ResponseEntity<Map<String, Object>> getTotalSpending(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Expense> expenses = expenseRepository.findByUser(user);
        double total = expenses.stream().mapToDouble(Expense::getAmount).sum();
        
        Map<String, Object> response = new HashMap<>();
        response.put("total", total);
        response.put("count", expenses.size());
        response.put("average", expenses.isEmpty() ? 0 : total / expenses.size());
        
        return ResponseEntity.ok(response);
    }

    @GetMapping("/{userId}/category-stats")
    public ResponseEntity<Map<String, Object>> getCategoryStats(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Expense> expenses = expenseRepository.findByUser(user);
        
        Map<String, Object> categoryStats = new HashMap<>();
        expenses.stream()
                .collect(Collectors.groupingBy(Expense::getCategory, 
                    Collectors.summingDouble(Expense::getAmount)))
                .forEach((category, total) -> {
                    Map<String, Object> stat = new HashMap<>();
                    stat.put("total", total);
                    stat.put("count", expenses.stream()
                            .filter(e -> e.getCategory().equals(category))
                            .count());
                    categoryStats.put(category, stat);
                });
        
        return ResponseEntity.ok(categoryStats);
    }

    @PutMapping("/{userId}/{expenseId}")
    public ResponseEntity<Expense> updateExpense(
            @PathVariable Long userId,
            @PathVariable Long expenseId,
            @RequestBody Expense expenseDetails
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        if (!expense.getUser().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        expense.setDescription(expenseDetails.getDescription());
        expense.setCategory(expenseDetails.getCategory());
        expense.setAmount(expenseDetails.getAmount());
        expense.setDate(expenseDetails.getDate());
        
        return ResponseEntity.ok(expenseRepository.save(expense));
    }

    @DeleteMapping("/{userId}/{expenseId}")
    public ResponseEntity<Void> deleteExpense(
            @PathVariable Long userId,
            @PathVariable Long expenseId
    ) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Expense expense = expenseRepository.findById(expenseId)
                .orElseThrow(() -> new RuntimeException("Expense not found"));
        
        if (!expense.getUser().getId().equals(userId)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }
        
        expenseRepository.delete(expense);
        return ResponseEntity.noContent().build();
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteAllExpenses(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Expense> expenses = expenseRepository.findByUser(user);
        expenseRepository.deleteAll(expenses);
        return ResponseEntity.noContent().build();
    }
}
