package com.example.accountbook.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@Schema(description = "가계부 거래내역 정보")
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "거래내역 고유 ID", example = "1")
    private Long id;

    @Schema(description = "거래내역 상세", example = "점심 식사")
    private String description;

    @Schema(description = "금액", example = "15000")
    private Long amount;

    @Schema(description = "카테고리명", example = "식비")
    private String category;

    @Schema(description = "거래일시", example = "2026-02-26T12:30:00")
    private LocalDateTime transactionDate;

}
