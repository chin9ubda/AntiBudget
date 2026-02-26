import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as api from './api';
import axios from 'axios';

vi.mock('axios', () => {
    const mockGet = vi.fn();
    const mockPost = vi.fn();
    const mockPut = vi.fn();
    const mockDelete = vi.fn();

    return {
        default: {
            create: vi.fn(() => ({
                get: mockGet,
                post: mockPost,
                put: mockPut,
                delete: mockDelete,
            })),
        },
    };
});

describe('API Client tests', () => {
    let mockGet: any;
    let mockPost: any;

    beforeEach(() => {
        const instance = (axios.create as any)();
        mockGet = instance.get;
        mockPost = instance.post;
        vi.clearAllMocks();
    });

    it('getTransactions should return transactions array', async () => {
        const mockData = [{ id: 1, amount: 100, category: 'food', description: 'desc', transactionDate: '2026-01-01' }];
        mockGet.mockResolvedValueOnce({ data: mockData });

        const result = await api.getTransactions();
        expect(result).toEqual(mockData);
        expect(mockGet).toHaveBeenCalledWith('/transactions');
    });

    it('createTransaction should return created transaction', async () => {
        const tx: api.Transaction = { amount: 100, category: 'food', description: 'desc', transactionDate: '2026-01-01' };
        const mockResponse = { id: 1, ...tx };
        mockPost.mockResolvedValueOnce({ data: mockResponse });

        const result = await api.createTransaction(tx);
        expect(result).toEqual(mockResponse);
        expect(mockPost).toHaveBeenCalledWith('/transactions', tx);
    });

    it('getFixedExpenses should return fixed expenses array', async () => {
        const mockData = [{ id: 1, description: 'Netflix', amount: -17000, category: 'Culture', type: 'expense' }];
        mockGet.mockResolvedValueOnce({ data: mockData });

        const result = await api.getFixedExpenses();
        expect(result).toEqual(mockData);
        expect(mockGet).toHaveBeenCalledWith('/fixed-expenses');
    });

    it('createFixedExpense should return created fixed expense', async () => {
        const exp: api.FixedExpense = { description: 'Netflix', amount: -17000, category: 'Culture', type: 'expense' };
        const mockResponse = { id: 1, ...exp };
        mockPost.mockResolvedValueOnce({ data: mockResponse });

        const result = await api.createFixedExpense(exp);
        expect(result).toEqual(mockResponse);
        expect(mockPost).toHaveBeenCalledWith('/fixed-expenses', exp);
    });
});
