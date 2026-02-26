package com.example.accountbook.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "fixed_expenses")
@Getter
@Setter
@NoArgsConstructor
@Schema(description = "고정 지출 정보")
public class FixedExpense {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "고정 지출 고유 ID", example = "1")
    private Long id;

    @Schema(description = "고정 지출 내역", example = "넷플릭스 구독")
    private String description;

    @Schema(description = "금액 (음수로 표기)", example = "-17000")
    private Long amount;

    @Schema(description = "카테고리", example = "문화/생활")
    private String category;

    @Schema(description = "타입 (\"income\" or \"expense\")", example = "expense")
    private String type; // "income" or "expense"

    public FixedExpense(String description, Long amount, String category, String type) {
        this.description = description;
        this.amount = amount;
        this.category = category;
        this.type = type;
    }
}
