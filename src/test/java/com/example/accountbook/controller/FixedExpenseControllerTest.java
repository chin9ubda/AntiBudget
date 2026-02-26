package com.example.accountbook.controller;

import com.example.accountbook.entity.FixedExpense;
import com.example.accountbook.service.FixedExpenseService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(FixedExpenseController.class)
public class FixedExpenseControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private FixedExpenseService fixedExpenseService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllFixedExpenses() throws Exception {
        FixedExpense exp = new FixedExpense("Netflix", -17000L, "Culture", "expense");
        exp.setId(1L);

        when(fixedExpenseService.getAllFixedExpenses()).thenReturn(List.of(exp));

        mockMvc.perform(get("/api/fixed-expenses"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].description").value("Netflix"))
                .andExpect(jsonPath("$[0].amount").value(-17000));
    }

    @Test
    void testCreateFixedExpense() throws Exception {
        FixedExpense inputExp = new FixedExpense("Rent", -500000L, "Housing", "expense");
        FixedExpense savedExp = new FixedExpense("Rent", -500000L, "Housing", "expense");
        savedExp.setId(1L);

        when(fixedExpenseService.createFixedExpense(any(FixedExpense.class))).thenReturn(savedExp);

        mockMvc.perform(post("/api/fixed-expenses")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputExp)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.description").value("Rent"));
    }

    @Test
    void testUpdateFixedExpense() throws Exception {
        FixedExpense inputExp = new FixedExpense("Internet", -30000L, "Housing", "expense");
        FixedExpense updatedExp = new FixedExpense("Internet", -30000L, "Housing", "expense");
        updatedExp.setId(1L);

        when(fixedExpenseService.updateFixedExpense(eq(1L), any(FixedExpense.class))).thenReturn(updatedExp);

        mockMvc.perform(put("/api/fixed-expenses/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputExp)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Internet"));
    }

    @Test
    void testDeleteFixedExpense() throws Exception {
        mockMvc.perform(delete("/api/fixed-expenses/1"))
                .andExpect(status().isNoContent());
    }
}
