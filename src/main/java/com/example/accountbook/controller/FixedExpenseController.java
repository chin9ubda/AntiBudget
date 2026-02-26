package com.example.accountbook.controller;

import com.example.accountbook.entity.FixedExpense;
import com.example.accountbook.service.FixedExpenseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/fixed-expenses")
@RequiredArgsConstructor
@Tag(name = "Fixed Expense Controller", description = "고정 지출 관리 API")
public class FixedExpenseController {

    private final FixedExpenseService service;

    @GetMapping
    @Operation(summary = "모든 고정 지출 조회", description = "등록된 전체 고정 지출 목록을 반환합니다.")
    public ResponseEntity<List<FixedExpense>> getAll() {
        return ResponseEntity.ok(service.getAllFixedExpenses());
    }

    @PostMapping
    @Operation(summary = "고정 지출 생성", description = "새로운 고정 지출 항목을 추가합니다.")
    public ResponseEntity<FixedExpense> create(@RequestBody FixedExpense expense) {
        return ResponseEntity.ok(service.createFixedExpense(expense));
    }

    @PutMapping("/{id}")
    @Operation(summary = "고정 지출 수정", description = "지정된 ID의 고정 지출 정보를 변경합니다.")
    public ResponseEntity<FixedExpense> update(@PathVariable Long id, @RequestBody FixedExpense expense) {
        return ResponseEntity.ok(service.updateFixedExpense(id, expense));
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "고정 지출 삭제", description = "지정된 ID의 고정 지출을 삭제합니다.")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.deleteFixedExpense(id);
        return ResponseEntity.noContent().build();
    }
}
