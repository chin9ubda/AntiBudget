package com.example.accountbook.controller;

import com.example.accountbook.entity.Category;
import com.example.accountbook.service.CategoryService;
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

@WebMvcTest(CategoryController.class)
public class CategoryControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private CategoryService categoryService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void testGetAllCategories() throws Exception {
        Category cat = new Category("Salary", "income");
        cat.setId(1L);

        when(categoryService.getAllCategories()).thenReturn(List.of(cat));

        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Salary"))
                .andExpect(jsonPath("$[0].type").value("income"));
    }

    @Test
    void testCreateCategory() throws Exception {
        Category inputCat = new Category("Snacks", "expense");
        Category savedCat = new Category("Snacks", "expense");
        savedCat.setId(1L);

        when(categoryService.createCategory(any(Category.class))).thenReturn(savedCat);

        mockMvc.perform(post("/api/categories")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputCat)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Snacks"));
    }

    @Test
    void testUpdateCategory() throws Exception {
        Category inputCat = new Category("Updated Name", "expense");
        Category updatedCat = new Category("Updated Name", "expense");
        updatedCat.setId(1L);

        when(categoryService.updateCategory(eq(1L), any(Category.class))).thenReturn(updatedCat);

        mockMvc.perform(put("/api/categories/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(inputCat)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"));
    }

    @Test
    void testDeleteCategory() throws Exception {
        mockMvc.perform(delete("/api/categories/1"))
                .andExpect(status().isNoContent());
    }
}
