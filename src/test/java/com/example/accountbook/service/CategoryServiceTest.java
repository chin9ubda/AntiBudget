package com.example.accountbook.service;

import com.example.accountbook.entity.Category;
import com.example.accountbook.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    @Test
    void testGetAllCategories() {
        Category cat1 = new Category("Test Income", "income");
        Category cat2 = new Category("Test Expense", "expense");
        when(categoryRepository.findAll()).thenReturn(Arrays.asList(cat1, cat2));

        List<Category> result = categoryService.getAllCategories();
        assertEquals(2, result.size());
        assertEquals("Test Income", result.get(0).getName());
    }

    @Test
    void testCreateCategory() {
        Category category = new Category("New Category", "expense");
        when(categoryRepository.save(any(Category.class))).thenReturn(category);

        Category result = categoryService.createCategory(category);
        assertEquals("New Category", result.getName());
        assertEquals("expense", result.getType());
    }

    @Test
    void testUpdateCategory() {
        Category existingCategory = new Category("Old Name", "expense");
        existingCategory.setId(1L);

        Category updatedDetails = new Category("New Name", "income");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(existingCategory));
        when(categoryRepository.save(any(Category.class))).thenReturn(existingCategory);

        Category result = categoryService.updateCategory(1L, updatedDetails);
        assertEquals("New Name", result.getName());
        assertEquals("income", result.getType());
    }

    @Test
    void testDeleteCategory() {
        Long categoryId = 1L;
        doNothing().when(categoryRepository).deleteById(categoryId);

        categoryService.deleteCategory(categoryId);

        verify(categoryRepository, times(1)).deleteById(categoryId);
    }
}
