package com.example.accountbook.service;

import com.example.accountbook.entity.Category;
import com.example.accountbook.repository.CategoryRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    @PostConstruct
    public void initDefaultCategories() {
        if (categoryRepository.count() == 0) {
            categoryRepository.save(new Category("월급", "income"));
            categoryRepository.save(new Category("용돈", "income"));
            categoryRepository.save(new Category("기타수입", "income"));

            categoryRepository.save(new Category("식비", "expense"));
            categoryRepository.save(new Category("교통비", "expense"));
            categoryRepository.save(new Category("문화/생활", "expense"));
            categoryRepository.save(new Category("마트/쇼핑", "expense"));
            categoryRepository.save(new Category("주거비", "expense"));
        }
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Category updateCategory(Long id, Category categoryDetails) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found with id: " + id));
        category.setName(categoryDetails.getName());
        category.setType(categoryDetails.getType());
        return categoryRepository.save(category);
    }

    public void deleteCategory(Long id) {
        // In a real app, you might want to prevent deletion if transactions are linked.
        categoryRepository.deleteById(id);
    }
}
