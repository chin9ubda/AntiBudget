import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8081/api', // Spring Boot App port
});

export interface Transaction {
    id?: number;
    description: string;
    amount: number;
    category: string;
    transactionDate: string;
}

export const getTransactions = async () => {
    const response = await api.get<Transaction[]>('/transactions');
    return response.data;
};

export const createTransaction = async (transaction: Transaction) => {
    const response = await api.post<Transaction>('/transactions', transaction);
    return response.data;
};

export const updateTransaction = async (id: number, transaction: Transaction) => {
    const response = await api.put<Transaction>(`/transactions/${id}`, transaction);
    return response.data;
};

export const deleteTransaction = async (id: number) => {
    await api.delete(`/transactions/${id}`);
};

// Categories API
export interface Category {
    id?: number;
    name: string;
    type: 'income' | 'expense';
}

export const getCategories = async () => {
    const response = await api.get<Category[]>('/categories');
    return response.data;
};

export const createCategory = async (category: Category) => {
    const response = await api.post<Category>('/categories', category);
    return response.data;
};

export const deleteCategory = async (id: number) => {
    await api.delete(`/categories/${id}`);
};

// Fixed Expenses API
export interface FixedExpense {
    id?: number;
    description: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
}

export const getFixedExpenses = async () => {
    const response = await api.get<FixedExpense[]>('/fixed-expenses');
    return response.data;
};

export const createFixedExpense = async (expense: FixedExpense) => {
    const response = await api.post<FixedExpense>('/fixed-expenses', expense);
    return response.data;
};

export const deleteFixedExpense = async (id: number) => {
    await api.delete(`/fixed-expenses/${id}`);
};
