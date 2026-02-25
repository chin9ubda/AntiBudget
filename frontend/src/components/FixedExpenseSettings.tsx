import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { FixedExpense, Category } from '../api';
import { createFixedExpense, deleteFixedExpense } from '../api';

interface Props {
    fixedExpenses: FixedExpense[];
    categories: Category[];
    onUpdate: () => void;
}

export default function FixedExpenseSettings({ fixedExpenses, categories, onUpdate }: Props) {
    const [desc, setDesc] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState<'income' | 'expense'>('expense');
    // Auto-select first matching category if available
    const typeCats = categories.filter(c => c.type === type);
    const [category, setCategory] = useState(typeCats.length > 0 ? typeCats[0].name : '');

    const handleTypeChange = (newType: 'income' | 'expense') => {
        setType(newType);
        const newTypeCats = categories.filter(c => c.type === newType);
        setCategory(newTypeCats.length > 0 ? newTypeCats[0].name : '');
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!desc.trim() || !amount || !category) return;

        const actualAmount = type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));

        try {
            await createFixedExpense({
                description: desc.trim(),
                amount: actualAmount,
                category,
                type
            });
            setDesc('');
            setAmount('');
            onUpdate();
        } catch (error) {
            console.error('Failed to add fixed expense', error);
        }
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        try {
            await deleteFixedExpense(id);
            onUpdate();
        } catch (error) {
            console.error('Failed to delete fixed expense', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-2">고정 지출/수입 (빠른 추가) 설정</h2>
            <p className="text-sm text-slate-500 mb-6">자주 발생하는 거래 내역을 등록해두고 터치 한 번으로 내역에 추가하세요.</p>

            <form onSubmit={handleAdd} className="space-y-4 mb-8 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                    <button
                        type="button"
                        onClick={() => handleTypeChange('expense')}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'expense' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        지출
                    </button>
                    <button
                        type="button"
                        onClick={() => handleTypeChange('income')}
                        className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-colors ${type === 'income' ? 'bg-slate-100 text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        수입
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">상세 내용</label>
                        <input
                            type="text"
                            value={desc}
                            onChange={e => setDesc(e.target.value)}
                            placeholder="예: 넷플릭스, 월급"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-slate-700 mb-1">금액 (원)</label>
                        <input
                            type="number"
                            value={amount}
                            onChange={e => setAmount(e.target.value)}
                            placeholder="금액"
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500"
                            required
                        />
                    </div>
                </div>

                <div className="flex items-end gap-4">
                    <div className="flex-1">
                        <label className="block text-xs font-medium text-slate-700 mb-1">카테고리</label>
                        <select
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-primary-500 bg-white"
                            required
                        >
                            {categories.filter(c => c.type === type).map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <button
                        type="submit"
                        className="bg-primary-600 hover:bg-primary-700 text-white min-w-[80px] px-4 py-2 font-medium text-sm rounded-lg transition-colors flex items-center justify-center h-[38px]"
                    >
                        추가
                    </button>
                </div>
            </form>

            <div className="space-y-3">
                {fixedExpenses.length === 0 ? (
                    <p className="text-center text-slate-400 py-4 text-sm">등록된 빠른 추가 항목이 없습니다.</p>
                ) : (
                    fixedExpenses.map(item => (
                        <div key={item.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-xl shadow-sm hover:border-slate-300 transition-colors">
                            <div className="flex items-center gap-3">
                                <span className={`text-xs px-2 py-1 rounded-md font-medium ${item.type === 'income' ? 'bg-primary-50 text-primary-600' : 'bg-red-50 text-red-600'}`}>
                                    {item.category}
                                </span>
                                <span className="font-medium text-slate-800 text-sm">{item.description}</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className={`font-bold ${item.type === 'income' ? 'text-primary-600' : 'text-red-500'}`}>
                                    {item.amount > 0 ? '+' : ''}{item.amount.toLocaleString()}원
                                </span>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
