package com.example.accountbook.service;

import com.example.accountbook.entity.FixedExpense;
import com.example.accountbook.repository.FixedExpenseRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FixedExpenseService {

    private final FixedExpenseRepository fixedExpenseRepository;

    @PostConstruct
    public void initDummyData() {
        if (fixedExpenseRepository.count() == 0) {
            fixedExpenseRepository.save(new FixedExpense("넷플릭스 구독", -17000L, "문화/생활", "expense"));
            fixedExpenseRepository.save(new FixedExpense("교통카드 정기충전", -50000L, "교통비", "expense"));
            fixedExpenseRepository.save(new FixedExpense("통신비(기본요금)", -65000L, "주거비", "expense"));
        }
    }

    public List<FixedExpense> getAllFixedExpenses() {
        return fixedExpenseRepository.findAll();
    }

    public FixedExpense createFixedExpense(FixedExpense fixedExpense) {
        return fixedExpenseRepository.save(fixedExpense);
    }

    public FixedExpense updateFixedExpense(Long id, FixedExpense details) {
        FixedExpense expense = fixedExpenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("FixedExpense not found with id: " + id));
        expense.setDescription(details.getDescription());
        expense.setAmount(details.getAmount());
        expense.setCategory(details.getCategory());
        expense.setType(details.getType());
        return fixedExpenseRepository.save(expense);
    }

    public void deleteFixedExpense(Long id) {
        fixedExpenseRepository.deleteById(id);
    }
}
