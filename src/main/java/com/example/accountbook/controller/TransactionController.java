package com.example.accountbook.controller;

import com.example.accountbook.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class TransactionController {

    private final TransactionService transactionService;

    // TODO: Add REST endpoints for Transaction CRUD

    @org.springframework.web.bind.annotation.PostMapping
    public org.springframework.http.ResponseEntity<com.example.accountbook.entity.Transaction> createTransaction(
            @org.springframework.web.bind.annotation.RequestBody com.example.accountbook.entity.Transaction transaction) {
        return org.springframework.http.ResponseEntity.ok(transactionService.saveTransaction(transaction));
    }

    @org.springframework.web.bind.annotation.GetMapping
    public org.springframework.http.ResponseEntity<java.util.List<com.example.accountbook.entity.Transaction>> getAllTransactions() {
        return org.springframework.http.ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @org.springframework.web.bind.annotation.GetMapping("/{id}")
    public org.springframework.http.ResponseEntity<com.example.accountbook.entity.Transaction> getTransactionById(
            @org.springframework.web.bind.annotation.PathVariable Long id) {
        return org.springframework.http.ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    public org.springframework.http.ResponseEntity<com.example.accountbook.entity.Transaction> updateTransaction(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestBody com.example.accountbook.entity.Transaction transactionDetails) {
        return org.springframework.http.ResponseEntity.ok(transactionService.updateTransaction(id, transactionDetails));
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public org.springframework.http.ResponseEntity<Void> deleteTransaction(
            @org.springframework.web.bind.annotation.PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }

}
