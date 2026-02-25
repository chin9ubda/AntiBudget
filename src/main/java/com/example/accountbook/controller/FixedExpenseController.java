package com.example.accountbook.controller;

import com.example.accountbook.entity.FixedExpense;
import com.example.accountbook.service.FixedExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/fixed-expenses")
@RequiredArgsConstructor
public class FixedExpenseController {

    private final FixedExpenseService service;

    @GetMapping
    public ResponseEntity<List<FixedExpense>> getAll() {
        return ResponseEntity.ok(service.getAllFixedExpenses());
    }

    @PostMapping
    public ResponseEntity<FixedExpense> create(@RequestBody FixedExpense expense) {
        return ResponseEntity.ok(service.createFixedExpense(expense));
    }

    @PutMapping("/{id}")
    public ResponseEntity<FixedExpense> update(@PathVariable Long id, @RequestBody FixedExpense expense) {
        return ResponseEntity.ok(service.updateFixedExpense(id, expense));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteFixedExpense(id);
        return ResponseEntity.noContent().build();
    }
}
