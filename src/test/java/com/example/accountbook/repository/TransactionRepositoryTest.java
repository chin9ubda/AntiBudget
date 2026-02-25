package com.example.accountbook.repository;

import com.example.accountbook.entity.Transaction;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
public class TransactionRepositoryTest {

    @Autowired
    private TransactionRepository transactionRepository;

    @Test
    void save_shouldPersistTransaction() {
        Transaction tx = new Transaction();
        tx.setDescription("Coffee");
        tx.setAmount(4500L);
        tx.setCategory("Food");
        tx.setTransactionDate(LocalDateTime.now());

        Transaction savedTx = transactionRepository.save(tx);

        assertThat(savedTx.getId()).isNotNull();
        assertThat(savedTx.getDescription()).isEqualTo("Coffee");

        Transaction found = transactionRepository.findById(savedTx.getId()).orElse(null);
        assertThat(found).isNotNull();
        assertThat(found.getAmount()).isEqualTo(4500L);
    }
}
