package com.example.accountbook.controller;

import com.example.accountbook.entity.Transaction;
import com.example.accountbook.service.TransactionService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Arrays;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(TransactionController.class)
public class TransactionControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private TransactionService transactionService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void createTransaction_ShouldReturnCreatedTransaction() throws Exception {
        Transaction tx = new Transaction();
        tx.setId(1L);
        tx.setDescription("Salary");
        tx.setAmount(3000000L);

        when(transactionService.saveTransaction(any(Transaction.class))).thenReturn(tx);

        mockMvc.perform(post("/api/transactions")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(tx)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Salary"))
                .andExpect(jsonPath("$.amount").value(3000000L));
    }

    @Test
    void getAllTransactions_ShouldReturnList() throws Exception {
        Transaction tx1 = new Transaction();
        tx1.setId(1L);
        tx1.setDescription("Salary");

        when(transactionService.getAllTransactions()).thenReturn(Arrays.asList(tx1));

        mockMvc.perform(get("/api/transactions"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].description").value("Salary"));
    }

    @Test
    void getTransactionById_ShouldReturnTransaction() throws Exception {
        Transaction tx = new Transaction();
        tx.setId(1L);
        tx.setDescription("Groceries");

        when(transactionService.getTransactionById(1L)).thenReturn(tx);

        mockMvc.perform(get("/api/transactions/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Groceries"));
    }

    @Test
    void deleteTransaction_ShouldReturnNoContent() throws Exception {
        doNothing().when(transactionService).deleteTransaction(1L);

        mockMvc.perform(delete("/api/transactions/1"))
                .andExpect(status().isNoContent());
    }
}
