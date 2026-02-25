import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import type { Transaction } from '../api';

interface Props {
    transactions: Transaction[];
    type: 'income' | 'expense';
}

const COLORS = ['#0ea5e9', '#3b82f6', '#8b5cf6', '#d946ef', '#f43f5e', '#f97316', '#eab308', '#22c55e'];

export default function AnalyticsChart({ transactions, type }: Props) {
    // Filter by type
    const filtered = transactions.filter(tx =>
        type === 'income' ? tx.amount > 0 : tx.amount < 0
    );

    // Group by category
    const grouped = filtered.reduce((acc, tx) => {
        const category = tx.category;
        const amount = Math.abs(tx.amount);
        if (!acc[category]) {
            acc[category] = 0;
        }
        acc[category] += amount;
        return acc;
    }, {} as Record<string, number>);

    // Format for Recharts
    const data = Object.entries(grouped)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value); // Sort by largest value

    if (data.length === 0) {
        return (
            <div className="h-64 flex items-center justify-center text-slate-400">
                데이터가 없습니다.
            </div>
        );
    }

    return (
        <div className="h-80 w-full mb-6 relative">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                        label={({ name, percent }) => `${name} (${((percent || 0) * 100).toFixed(0)}%)`}
                        labelLine={true}
                    >
                        {data.map((_, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: any) => `₩${Number(value).toLocaleString()}`}
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend verticalAlign="bottom" height={36} />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
