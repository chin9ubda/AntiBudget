package com.example.accountbook.service;

import com.example.accountbook.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;

    // TODO: Add business logic for Transaction CRUD

    public com.example.accountbook.entity.Transaction saveTransaction(
            com.example.accountbook.entity.Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public java.util.List<com.example.accountbook.entity.Transaction> getAllTransactions() {
        return transactionRepository.findAll();
    }

    public com.example.accountbook.entity.Transaction getTransactionById(Long id) {
        return transactionRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Transaction not found with id: " + id));
    }

    public com.example.accountbook.entity.Transaction updateTransaction(Long id,
            com.example.accountbook.entity.Transaction transactionDetails) {
        com.example.accountbook.entity.Transaction transaction = getTransactionById(id);

        transaction.setDescription(transactionDetails.getDescription());
        transaction.setAmount(transactionDetails.getAmount());
        transaction.setCategory(transactionDetails.getCategory());
        transaction.setTransactionDate(transactionDetails.getTransactionDate());

        return transactionRepository.save(transaction);
    }

    public void deleteTransaction(Long id) {
        transactionRepository.deleteById(id);
    }

}
