package com.example.accountbook.service;

import com.example.accountbook.entity.Transaction;
import com.example.accountbook.repository.TransactionRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @InjectMocks
    private TransactionService transactionService;

    @Test
    void saveTransaction_shouldReturnSavedTransaction() {
        Transaction tx = new Transaction();
        tx.setDescription("Groceries");
        tx.setAmount(50000L);
        tx.setCategory("Food");
        tx.setTransactionDate(LocalDateTime.now());

        when(transactionRepository.save(any(Transaction.class))).thenReturn(tx);

        Transaction savedTx = transactionService.saveTransaction(tx);

        assertThat(savedTx).isNotNull();
        assertThat(savedTx.getDescription()).isEqualTo("Groceries");
        verify(transactionRepository, times(1)).save(tx);
    }

    @Test
    void getAllTransactions_shouldReturnListOfTransactions() {
        Transaction tx1 = new Transaction();
        tx1.setId(1L);
        Transaction tx2 = new Transaction();
        tx2.setId(2L);

        when(transactionRepository.findAll()).thenReturn(Arrays.asList(tx1, tx2));

        List<Transaction> transactions = transactionService.getAllTransactions();

        assertThat(transactions).hasSize(2);
        verify(transactionRepository, times(1)).findAll();
    }

    @Test
    void getTransactionById_shouldReturnTransactionWhenExists() {
        Transaction tx = new Transaction();
        tx.setId(1L);
        tx.setDescription("Test");

        when(transactionRepository.findById(1L)).thenReturn(Optional.of(tx));

        Transaction result = transactionService.getTransactionById(1L);

        assertThat(result.getDescription()).isEqualTo("Test");
    }

    @Test
    void getTransactionById_shouldThrowExceptionWhenNotFound() {
        when(transactionRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> transactionService.getTransactionById(1L));
    }

    @Test
    void deleteTransaction_shouldCallDeleteById() {
        doNothing().when(transactionRepository).deleteById(1L);

        transactionService.deleteTransaction(1L);

        verify(transactionRepository, times(1)).deleteById(1L);
    }

    @Test
    void updateTransaction_shouldUpdateExistingTransaction() {
        Transaction existingTx = new Transaction();
        existingTx.setId(1L);
        existingTx.setDescription("Old Description");
        existingTx.setAmount(1000L);
        existingTx.setCategory("Old Category");
        existingTx.setTransactionDate(LocalDateTime.now());

        Transaction updatedDetails = new Transaction();
        updatedDetails.setDescription("New Description");
        updatedDetails.setAmount(2000L);
        updatedDetails.setCategory("New Category");
        updatedDetails.setTransactionDate(LocalDateTime.now().plusDays(1));

        when(transactionRepository.findById(1L)).thenReturn(Optional.of(existingTx));
        when(transactionRepository.save(any(Transaction.class))).thenReturn(existingTx);

        Transaction result = transactionService.updateTransaction(1L, updatedDetails);

        assertThat(result.getDescription()).isEqualTo("New Description");
        assertThat(result.getAmount()).isEqualTo(2000L);
        assertThat(result.getCategory()).isEqualTo("New Category");
        verify(transactionRepository, times(1)).save(existingTx);
    }
}
