package com.example.accountbook.repository;

import com.example.accountbook.entity.FixedExpense;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FixedExpenseRepository extends JpaRepository<FixedExpense, Long> {
}
