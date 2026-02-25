package com.example.accountbook.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "fixed_expenses")
@Getter
@Setter
@NoArgsConstructor
public class FixedExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String description;

    private Long amount;

    private String category;

    private String type; // "income" or "expense"

    public FixedExpense(String description, Long amount, String category, String type) {
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.type = type;
    }
}
