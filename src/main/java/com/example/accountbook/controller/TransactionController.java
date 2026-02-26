package com.example.accountbook.controller;

import com.example.accountbook.service.TransactionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.bind.annotation.CrossOrigin;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
@Tag(name = "Transaction Controller", description = "가계부 거래 관리 API")
public class TransactionController {

    private final TransactionService transactionService;

    // TODO: Add REST endpoints for Transaction CRUD

    @org.springframework.web.bind.annotation.PostMapping
    @Operation(summary = "거래내역 생성", description = "새로운 가계부 거래내역을 추가합니다.")
    public org.springframework.http.ResponseEntity<com.example.accountbook.entity.Transaction> createTransaction(
            @org.springframework.web.bind.annotation.RequestBody com.example.accountbook.entity.Transaction transaction) {
        return org.springframework.http.ResponseEntity.ok(transactionService.saveTransaction(transaction));
    }

    @org.springframework.web.bind.annotation.GetMapping
    @Operation(summary = "모든 거래내역 조회", description = "가계부의 모든 거래내역을 반환합니다.")
    public org.springframework.http.ResponseEntity<java.util.List<com.example.accountbook.entity.Transaction>> getAllTransactions() {
        return org.springframework.http.ResponseEntity.ok(transactionService.getAllTransactions());
    }

    @org.springframework.web.bind.annotation.GetMapping("/{id}")
    @Operation(summary = "단일 거래내역 조회", description = "지정된 ID의 상세 거래내역을 가져옵니다.")
    public org.springframework.http.ResponseEntity<com.example.accountbook.entity.Transaction> getTransactionById(
            @org.springframework.web.bind.annotation.PathVariable Long id) {
        return org.springframework.http.ResponseEntity.ok(transactionService.getTransactionById(id));
    }

    @org.springframework.web.bind.annotation.PutMapping("/{id}")
    @Operation(summary = "거래내역 수정", description = "기존 거래내역의 정보를 업데이트합니다.")
    public org.springframework.http.ResponseEntity<com.example.accountbook.entity.Transaction> updateTransaction(
            @org.springframework.web.bind.annotation.PathVariable Long id,
            @org.springframework.web.bind.annotation.RequestBody com.example.accountbook.entity.Transaction transactionDetails) {
        return org.springframework.http.ResponseEntity.ok(transactionService.updateTransaction(id, transactionDetails));
    }

    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    @Operation(summary = "거래내역 삭제", description = "지정된 ID의 거래내역을 삭제합니다.")
    public org.springframework.http.ResponseEntity<Void> deleteTransaction(
            @org.springframework.web.bind.annotation.PathVariable Long id) {
        transactionService.deleteTransaction(id);
        return org.springframework.http.ResponseEntity.noContent().build();
    }

}
