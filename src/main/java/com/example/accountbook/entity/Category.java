package com.example.accountbook.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import io.swagger.v3.oas.annotations.media.Schema;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@Schema(description = "카테고리 정보")
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Schema(description = "카테고리 고유 ID", example = "1")
    private Long id;

    @Schema(description = "카테고리명", example = "식비")
    private String name;

    @Schema(description = "수입/지출 구분 (\"income\" or \"expense\")", example = "expense")
    private String type;

    public Category(String name, String type) {
        this.name = name;
        this.type = type;
    }
}
