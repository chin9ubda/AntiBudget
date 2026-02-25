import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, PlusCircle, Trash2, TrendingDown, TrendingUp, Wallet, BarChart3, Settings } from 'lucide-react';
import type { Transaction, Category, FixedExpense } from './api';
import { createTransaction, deleteTransaction, getTransactions, updateTransaction, getCategories, getFixedExpenses } from './api';
import AnalyticsChart from './components/AnalyticsChart';
import CategorySettings from './components/CategorySettings';
import FixedExpenseSettings from './components/FixedExpenseSettings';

function App() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  // Form State
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [type, setType] = useState<'income' | 'expense'>('expense');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [editingId, setEditingId] = useState<number | null>(null);

  // New State variables for Tabs and Categories
  const [activeTab, setActiveTab] = useState<'transactions' | 'analytics' | 'settings'>('transactions');
  const [categories, setCategories] = useState<Category[]>([]);
  const [fixedExpenses, setFixedExpenses] = useState<FixedExpense[]>([]);

  // Month Filter State
  const [monthMode, setMonthMode] = useState<'standard' | 'salary'>('salary');

  // Utility to calculate payday (used for both initial state and filtering)
  const getPayday = (year: number, month: number): Date => {
    const d = new Date(year, month, 25);
    if (d.getDay() === 6) d.setDate(24); // Saturday → Friday
    else if (d.getDay() === 0) d.setDate(23); // Sunday → Friday
    return d;
  };

  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date();
    const thisMonthPayday = getPayday(now.getFullYear(), now.getMonth());
    // If today >= this month's payday, we are in the next month's salary cycle
    if (now.getTime() >= thisMonthPayday.getTime()) {
      return new Date(now.getFullYear(), now.getMonth() + 1, 1);
    }
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [txData, catData, fxData] = await Promise.all([
        getTransactions(),
        getCategories(),
        getFixedExpenses()
      ]);
      setTransactions(txData);
      setCategories(catData);
      setFixedExpenses(fxData);
      // set an initial category so the form isn't empty on load
      const expenseCats = catData.filter(c => c.type === 'expense');
      if (expenseCats.length > 0 && !category) {
        setCategory(expenseCats[0].name);
      }
    } catch (error) {
      console.error('Failed to fetch initial data', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const catData = await getCategories();
      setCategories(catData);
    } catch (error) {
      console.error('Failed to fetch categories', error);
    }
  };

  const fetchFixedExpenses = async () => {
    try {
      const fxData = await getFixedExpenses();
      setFixedExpenses(fxData);
    } catch (error) {
      console.error('Failed to fetch fixed expenses', error);
    }
  };

  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount || !category) return;

    const actualAmount = type === 'expense' ? -Math.abs(Number(amount)) : Math.abs(Number(amount));

    // Convert local date string to full ISO timestamp
    const transactionDateObj = new Date(date);
    // Add current time back to make it a full timestamp if preferred, or just leave as midnight UTC
    const transactionDateStr = isNaN(transactionDateObj.getTime()) ? new Date().toISOString() : new Date(date + 'T12:00:00Z').toISOString();

    const txData: Transaction = {
      description,
      amount: actualAmount,
      category: category,
      transactionDate: transactionDateStr
    };

    try {
      if (editingId) {
        const updated = await updateTransaction(editingId, txData);
        setTransactions(transactions.map(t => t.id === editingId ? updated : t));
        setEditingId(null);
      } else {
        const saved = await createTransaction(txData);
        setTransactions([...transactions, saved]);
      }
      resetForm();
    } catch (error) {
      console.error('Failed to save transaction', error);
    }
  };

  const handleQuickAdd = async (fx: FixedExpense) => {
    const txData: Transaction = {
      description: fx.description,
      amount: fx.type === 'expense' ? -Math.abs(fx.amount) : Math.abs(fx.amount),
      category: fx.category,
      transactionDate: new Date(date + 'T12:00:00Z').toISOString()
    };
    try {
      const saved = await createTransaction(txData);
      setTransactions([...transactions, saved]);
    } catch (error) {
      console.error('Failed to save quick transaction', error);
    }
  };

  const resetForm = () => {
    setDescription('');
    setAmount('');
    setDate(new Date().toISOString().split('T')[0]);
    setEditingId(null);
    handleTypeChange('expense');
  };

  const handleTypeChange = (newType: 'income' | 'expense') => {
    setType(newType);
    const typeCats = categories.filter(c => c.type === newType);
    if (typeCats.length > 0) {
      setCategory(typeCats[0].name);
    } else {
      setCategory('');
    }
  };

  const startEdit = (tx: Transaction) => {
    setEditingId(tx.id!);
    setDescription(tx.description);
    setAmount(Math.abs(tx.amount).toString());
    setType(tx.amount > 0 ? 'income' : 'expense');
    setCategory(tx.category);

    // Extract YYYY-MM-DD from timestamp
    const txDate = new Date(tx.transactionDate);
    if (!isNaN(txDate.getTime())) {
      setDate(txDate.toISOString().split('T')[0]);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteTransaction(id);
      setTransactions(transactions.filter(t => t.id !== id));
    } catch (error) {
      console.error('Failed to delete transaction', error);
    }
  };

  // Month Navigation Handlers
  const handlePrevMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // Filtering Logic
  const filteredTransactions = transactions.filter(tx => {
    const txDate = new Date(tx.transactionDate);

    if (monthMode === 'standard') {
      return txDate.getFullYear() === currentMonth.getFullYear() &&
        txDate.getMonth() === currentMonth.getMonth();
    } else {
      // Salary Mode: From (Previous Month Payday) to (Current Month Payday - 1 day)
      // Actually, if we are viewing "February", it usually means the salary received in Feb to March, 
      // or Jan to Feb. Let's make viewing "February" mean the budget cycle that ends in February:
      // Jan payday <= date < Feb payday
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();

      const prevPayday = getPayday(month === 0 ? year - 1 : year, month === 0 ? 11 : month - 1);
      const currentPayday = getPayday(year, month);

      // Zero out time for clean comparison, or just compare timestamps (txDate already has time, payday is midnight)
      return txDate.getTime() >= prevPayday.getTime() && txDate.getTime() < currentPayday.getTime();
    }
  });

  const totalBalance = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
  const totalIncome = filteredTransactions.filter(t => t.amount > 0).reduce((sum, tx) => sum + tx.amount, 0);
  const totalExpense = Math.abs(filteredTransactions.filter(t => t.amount < 0).reduce((sum, tx) => sum + tx.amount, 0));

  if (loading) return <div className="min-h-screen grid items-center justify-center"><p className="text-xl font-semibold text-slate-500">가계부 데이터를 불러오는 중입니다...</p></div>;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="bg-primary-500 p-3 rounded-xl shadow-sm">
            <Wallet className="w-8 h-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">안티버젯 (AntiBudget)</h1>
            <p className="text-slate-500 mt-1">당신의 예산을 한눈에 효율적으로 관리하세요.</p>
          </div>
        </div>

        {/* Month Selector Widget */}
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-slate-500">조회 기준:</span>
            <select
              value={monthMode}
              onChange={e => setMonthMode(e.target.value as 'standard' | 'salary')}
              className="text-sm bg-slate-50 border border-slate-200 text-slate-700 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="standard">1일 ~ 말일</option>
              <option value="salary">월급일(25일) 기준</option>
            </select>
          </div>

          <div className="flex items-center bg-white rounded-xl shadow-sm border border-slate-100 p-1">
            <button
              onClick={handlePrevMonth}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="min-w-[140px] text-center flex flex-col items-center justify-center">
              <span className="font-semibold text-slate-800 leading-tight">
                {currentMonth.getFullYear()}년 {currentMonth.getMonth() + 1}월
              </span>
              {monthMode === 'salary' && (
                <span className="text-[10px] text-slate-400 mt-0.5 whitespace-nowrap">
                  {currentMonth.getMonth() === 0 ? 12 : currentMonth.getMonth()}월 급여주기
                </span>
              )}
            </div>
            <button
              onClick={handleNextMonth}
              className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-50 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">총 잔액</p>
            <p className={`text-2xl font-bold mt-2 ${totalBalance < 0 ? 'text-red-500' : 'text-slate-900'}`}>
              ₩{totalBalance.toLocaleString()}
            </p>
          </div>
          <div className="h-12 w-12 bg-slate-50 rounded-full flex items-center justify-center">
            <Wallet className="w-6 h-6 text-slate-600" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">총 수입</p>
            <p className="text-2xl font-bold mt-2 text-primary-600">
              +₩{totalIncome.toLocaleString()}
            </p>
          </div>
          <div className="h-12 w-12 bg-primary-50 rounded-full flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary-500" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">총 지출</p>
            <p className="text-2xl font-bold mt-2 text-red-500">
              -₩{totalExpense.toLocaleString()}
            </p>
          </div>
          <div className="h-12 w-12 bg-red-50 rounded-full flex items-center justify-center">
            <TrendingDown className="w-6 h-6 text-red-500" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex bg-white rounded-2xl shadow-sm border border-slate-100 p-2 mb-10 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('transactions')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${activeTab === 'transactions' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <Wallet className="w-5 h-5" /> 내역 관리
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${activeTab === 'analytics' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <BarChart3 className="w-5 h-5" /> 월별 통계
        </button>
        <button
          onClick={() => setActiveTab('settings')}
          className={`flex-1 min-w-[120px] flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-medium transition-colors ${activeTab === 'settings' ? 'bg-primary-50 text-primary-700' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'}`}
        >
          <Settings className="w-5 h-5" /> 카테고리 설정
        </button>
      </div>

      {activeTab === 'settings' && (
        <div className="space-y-6">
          <CategorySettings categories={categories} onCategoryChange={fetchCategories} />
          <FixedExpenseSettings fixedExpenses={fixedExpenses} categories={categories} onUpdate={fetchFixedExpenses} />
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">지출 통계</h3>
            <AnalyticsChart transactions={filteredTransactions} type="expense" />
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-6 text-center">수입 통계</h3>
            <AnalyticsChart transactions={filteredTransactions} type="income" />
          </div>
        </div>
      )}

      {activeTab === 'transactions' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Form Section */}
          <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 h-fit">

            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">{editingId ? '결제 내역 수정' : '결제 내역 추가'}</h2>
              {editingId && (
                <button onClick={resetForm} type="button" className="text-xs text-slate-500 hover:text-slate-800 underline">
                  취소
                </button>
              )}
            </div>
            <form onSubmit={handleAddTransaction} className="space-y-4">

              {/* Type Toggle */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button
                  type="button"
                  onClick={() => handleTypeChange('expense')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === 'expense' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  지출
                </button>
                <button
                  type="button"
                  onClick={() => handleTypeChange('income')}
                  className={`flex-1 py-2 text-sm font-medium rounded-lg transition-colors ${type === 'income' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                >
                  수입
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">상세 내용</label>
                <input
                  type="text"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="예: 월급, 점심 식사"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">금액</label>
                <input
                  type="number"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">날짜</label>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">카테고리</label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all bg-white"
                >
                  <option value="">-- 선택하세요 --</option>
                  {categories.filter(c => c.type === type).map(cat => (
                    <option key={cat.id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full mt-4 bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                {editingId ? '수정 완료' : <><PlusCircle className="w-5 h-5" />내역 추가</>}
              </button>
            </form>

            {/* Quick Add Chips */}
            {fixedExpenses.length > 0 && !editingId && (
              <div className="mt-8 pt-6 border-t border-slate-100">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-3">빠른 추가 (고정 지출)</span>
                <div className="flex flex-wrap gap-2">
                  {fixedExpenses.map(fx => (
                    <button
                      key={fx.id}
                      onClick={() => handleQuickAdd(fx)}
                      className={`text-xs px-3 py-2 rounded-lg font-medium transition-all hover:-translate-y-0.5 shadow-sm hover:shadow active:scale-95 ${fx.type === 'income' ? 'bg-primary-50 text-primary-700 hover:bg-primary-100' : 'bg-red-50 text-red-700 border hover:bg-red-100'}`}
                      type="button"
                    >
                      {fx.description} {fx.amount > 0 ? '+' : ''}{fx.amount.toLocaleString()}원
                    </button>
                  ))}
                </div>
              </div>
            )}
          </section>

          {/* List Section */}
          <section className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-lg font-bold text-slate-800">{currentMonth.getMonth() + 1}월 내역</h2>
              <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-3 py-1 rounded-full">총 {filteredTransactions.length}건</span>
            </div>

            <div className="p-6">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-10">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Wallet className="w-8 h-8 text-slate-300" />
                  </div>
                  <p className="text-slate-500">선택한 월(달)에 등록된 내역이 없습니다.</p>
                </div>
              ) : (
                <ul className="space-y-4">
                  {filteredTransactions.slice().reverse().map((tx) => (
                    <li key={tx.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-primary-100 hover:bg-slate-50 transition-all group gap-4 sm:gap-0">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 shrink-0 rounded-full flex items-center justify-center ${tx.amount > 0 ? 'bg-primary-50 text-primary-600' : 'bg-red-50 text-red-500'
                          }`}>
                          {tx.amount > 0 ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-slate-800 truncate">{tx.description}</p>
                          <p className="text-sm text-slate-500 flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="bg-slate-100 px-2 py-0.5 rounded-md text-xs font-medium whitespace-nowrap">{tx.category}</span>
                            <span className="whitespace-nowrap">{new Date(tx.transactionDate).toLocaleDateString()}</span>
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
                        <span className={`font-bold text-lg ${tx.amount > 0 ? 'text-primary-600' : 'text-slate-800'}`}>
                          {tx.amount > 0 ? '+' : ''}₩{tx.amount.toLocaleString()}
                        </span>
                        <div className="flex gap-1 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => startEdit(tx)}
                            className="text-slate-500 hover:text-primary-600 p-2 hover:bg-primary-50 rounded-lg cursor-pointer text-sm font-medium"
                            title="Edit transaction"
                          >
                            수정
                          </button>
                          <button
                            onClick={() => tx.id && handleDelete(tx.id)}
                            className="text-slate-500 hover:text-red-500 p-2 hover:bg-red-50 rounded-lg cursor-pointer"
                            title="Delete transaction"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
