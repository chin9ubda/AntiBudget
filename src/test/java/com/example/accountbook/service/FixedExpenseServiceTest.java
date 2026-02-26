package com.example.accountbook.service;

import com.example.accountbook.entity.FixedExpense;
import com.example.accountbook.repository.FixedExpenseRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class FixedExpenseServiceTest {

    @Mock
    private FixedExpenseRepository fixedExpenseRepository;

    @InjectMocks
    private FixedExpenseService fixedExpenseService;

    @Test
    void createFixedExpense_shouldReturnSavedExpense() {
        FixedExpense expense = new FixedExpense("Netflix", -17000L, "Culture", "expense");
        when(fixedExpenseRepository.save(any(FixedExpense.class))).thenReturn(expense);

        FixedExpense savedExpense = fixedExpenseService.createFixedExpense(expense);

        assertThat(savedExpense).isNotNull();
        assertThat(savedExpense.getDescription()).isEqualTo("Netflix");
        verify(fixedExpenseRepository, times(1)).save(expense);
    }

    @Test
    void getAllFixedExpenses_shouldReturnListOfExpenses() {
        FixedExpense exp1 = new FixedExpense("Netflix", -17000L, "Culture", "expense");
        exp1.setId(1L);
        FixedExpense exp2 = new FixedExpense("Rent", -500000L, "Housing", "expense");
        exp2.setId(2L);

        when(fixedExpenseRepository.findAll()).thenReturn(Arrays.asList(exp1, exp2));

        List<FixedExpense> expenses = fixedExpenseService.getAllFixedExpenses();

        assertThat(expenses).hasSize(2);
        verify(fixedExpenseRepository, times(1)).findAll();
    }

    @Test
    void updateFixedExpense_shouldUpdateExistingExpense() {
        FixedExpense existing = new FixedExpense("Old", -100L, "OldCat", "expense");
        existing.setId(1L);

        FixedExpense updatedDetails = new FixedExpense("New", -200L, "NewCat", "expense");

        when(fixedExpenseRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(fixedExpenseRepository.save(any(FixedExpense.class))).thenReturn(existing);

        FixedExpense result = fixedExpenseService.updateFixedExpense(1L, updatedDetails);

        assertThat(result.getDescription()).isEqualTo("New");
        assertThat(result.getAmount()).isEqualTo(-200L);
        assertThat(result.getCategory()).isEqualTo("NewCat");
        verify(fixedExpenseRepository, times(1)).save(existing);
    }

    @Test
    void updateFixedExpense_shouldThrowExceptionWhenNotFound() {
        when(fixedExpenseRepository.findById(1L)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> fixedExpenseService.updateFixedExpense(1L, new FixedExpense()));
    }

    @Test
    void deleteFixedExpense_shouldCallDeleteById() {
        doNothing().when(fixedExpenseRepository).deleteById(1L);

        fixedExpenseService.deleteFixedExpense(1L);

        verify(fixedExpenseRepository, times(1)).deleteById(1L);
    }
}
