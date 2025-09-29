import React, { useState, useCallback, useMemo } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { Expense, Category, View, Saving } from './types';
import Header from './components/Header';
import ExpenseForm from './components/ExpenseForm';
import AnalyticsDashboard from './components/AnalyticsDashboard';
import ExpenseHistory from './components/ExpenseHistory';
import CategoryManager from './components/CategoryManager';
import SavingGoals from './components/SavingGoals';

const defaultCategories: Category[] = [
  { id: '1', name: 'Food', color: '#EC4899' },
  { id: '2', name: 'Transit', color: '#3B82F6' },
  { id: '3', name: 'Shopping', color: '#F97316' },
  { id: '4', name: 'Groceries', color: '#22C55E' },
  { id: '5', name: 'Entertainment', color: '#8B5CF6' },
  { id: '8', name: 'Eating Out', color: '#EAB308' },
  { id: '7', name: 'Gas', color: '#EF4444' },
  { id: '9', name: 'Chocolate', color: '#78350F' },
  { id: '10', name: 'Hiking', color: '#14B8A6' },
  { id: '11', name: 'Gifts', color: '#D946EF' },
  { id: '6', name: 'Other', color: '#64748B' },
];

const App: React.FC = () => {
  const [expenses, setExpenses] = useLocalStorage<Expense[]>('expenses', []);
  const [savings, setSavings] = useLocalStorage<Saving[]>('savings', []);
  const [savingGoal, setSavingGoal] = useLocalStorage<number>('savingGoal', 1000);
  const [categories, setCategories] = useLocalStorage<Category[]>('categories', defaultCategories);
  const [view, setView] = useState<View>('home');

  const addExpense = useCallback((expense: Omit<Expense, 'id'>) => {
    setExpenses(prev => [{ ...expense, id: Date.now().toString() }, ...prev]);
  }, [setExpenses]);

  const addSaving = useCallback((saving: Omit<Saving, 'id'>) => {
    setSavings(prev => [{ ...saving, id: Date.now().toString() }, ...prev]);
  }, [setSavings]);

  const deleteExpense = useCallback((id: string) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  }, [setExpenses]);

  const addCategory = useCallback((category: Omit<Category, 'id'>) => {
    setCategories(prev => [...prev, { ...category, id: Date.now().toString() }]);
  }, [setCategories]);

  const deleteCategory = useCallback((id: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== id));
    // Optional: Re-categorize expenses under the deleted category to 'Other' or null
  }, [setCategories]);
  
  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach(cat => map.set(cat.id, cat));
    return map;
  }, [categories]);

  const expensesWithCategoryDetails = useMemo(() => {
    return expenses.map(expense => ({
      ...expense,
      category: categoryMap.get(expense.categoryId) || { id: 'unknown', name: 'Uncategorized', color: '#808080' }
    }));
  }, [expenses, categoryMap]);
  
  const savingsWithCategoryDetails = useMemo(() => {
    return savings.map(saving => ({
      ...saving,
      category: categoryMap.get(saving.categoryId) || { id: 'unknown', name: 'Uncategorized', color: '#808080' }
    }));
  }, [savings, categoryMap]);


  const renderView = () => {
    switch (view) {
      case 'analytics':
        return <AnalyticsDashboard expenses={expensesWithCategoryDetails} />;
      case 'history':
        return <ExpenseHistory expenses={expensesWithCategoryDetails} deleteExpense={deleteExpense} />;
      case 'categories':
        return <CategoryManager categories={categories} addCategory={addCategory} deleteCategory={deleteCategory} />;
      case 'savings':
        return <SavingGoals 
                  savings={savingsWithCategoryDetails}
                  addSaving={addSaving}
                  categories={categories}
                  goal={savingGoal}
                  setGoal={setSavingGoal}
                />;
      case 'home':
      default:
        return <ExpenseForm categories={categories} addExpense={addExpense} />;
    }
  };

  return (
    <div className="min-h-screen text-slate-800 transition-colors duration-300">
      <Header currentView={view} setView={setView} />
      <main className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
        {renderView()}
      </main>
    </div>
  );
};

export default App;