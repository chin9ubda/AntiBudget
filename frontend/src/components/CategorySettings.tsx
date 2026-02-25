import { useState } from 'react';
import { PlusCircle, Trash2 } from 'lucide-react';
import type { Category } from '../api';
import { createCategory, deleteCategory } from '../api';

interface Props {
    categories: Category[];
    onCategoryChange: () => void;
}

export default function CategorySettings({ categories, onCategoryChange }: Props) {
    const [newCatName, setNewCatName] = useState('');
    const [newCatType, setNewCatType] = useState<'income' | 'expense'>('expense');

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCatName.trim()) return;

        try {
            await createCategory({ name: newCatName.trim(), type: newCatType });
            setNewCatName('');
            onCategoryChange();
        } catch (error) {
            console.error('Failed to add category', error);
        }
    };

    const handleDelete = async (id?: number) => {
        if (!id) return;
        try {
            await deleteCategory(id);
            onCategoryChange();
        } catch (error) {
            console.error('Failed to delete category', error);
        }
    };

    return (
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-800 mb-6">카테고리 설정</h2>

            <form onSubmit={handleAdd} className="flex gap-4 mb-8">
                <select
                    value={newCatType}
                    onChange={e => setNewCatType(e.target.value as 'income' | 'expense')}
                    className="px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none bg-white"
                >
                    <option value="expense">지출</option>
                    <option value="income">수입</option>
                </select>

                <input
                    type="text"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                    placeholder="새 카테고리 이름"
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                />

                <button
                    type="submit"
                    className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 transition-colors"
                >
                    <PlusCircle className="w-5 h-5" />
                    추가
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-bold text-red-500 mb-4 border-b pb-2">지출 카테고리</h3>
                    <ul className="space-y-2">
                        {categories.filter(c => c.type === 'expense').map(cat => (
                            <li key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-slate-700">{cat.name}</span>
                                <button onClick={() => handleDelete(cat.id)} className="text-slate-400 hover:text-red-500 p-1">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <h3 className="font-bold text-primary-600 mb-4 border-b pb-2">수입 카테고리</h3>
                    <ul className="space-y-2">
                        {categories.filter(c => c.type === 'income').map(cat => (
                            <li key={cat.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
                                <span className="text-slate-700">{cat.name}</span>
                                <button onClick={() => handleDelete(cat.id)} className="text-slate-400 hover:text-red-500 p-1">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
