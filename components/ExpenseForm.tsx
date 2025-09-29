import React, { useState } from 'react';
import { Expense, Category } from '../types';
import { PlusCircleIcon } from './icons';

interface ExpenseFormProps {
  categories: Category[];
  addExpense: (expense: Omit<Expense, 'id'>) => void;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({ categories, addExpense }) => {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories.length > 0 ? categories[0].id : '');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount || parseFloat(amount) <= 0) {
      setError('Please enter a valid amount.');
      return;
    }
    if (!categoryId) {
      setError('Please select a category.');
      return;
    }
    setError('');

    addExpense({
      amount: parseFloat(amount),
      categoryId,
      details,
      date,
    });
    
    setSuccess(`Expense of $${amount} added successfully!`);
    setAmount('');
    setDetails('');
    setDate(new Date().toISOString().split('T')[0]);
    if (categories.length > 0) setCategoryId(categories[0].id);

    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-4xl font-bold mb-4 text-slate-800">Add New Expense</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amount" className="block text-lg font-medium text-slate-600">Amount</label>
          <div className="mt-1 relative rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
              <span className="text-slate-500 sm:text-lg">$</span>
            </div>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="block w-full rounded-md border-slate-300 pl-7 pr-2 py-2 focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg"
              placeholder="0.00"
              step="0.01"
            />
          </div>
        </div>

        <div>
          <label htmlFor="category" className="block text-lg font-medium text-slate-600">Category</label>
          <select
            id="category"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-xl focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-lg"
          >
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="details" className="block text-lg font-medium text-slate-600">Details (Optional)</label>
          <input
            type="text"
            id="details"
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg"
            placeholder="e.g., Lunch with team"
          />
        </div>

        <div>
          <label htmlFor="date" className="block text-lg font-medium text-slate-600">Date</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg"
          />
        </div>
        
        {error && <p className="text-lg text-red-500">{error}</p>}
        {success && <p className="text-lg text-green-500">{success}</p>}

        <button
          type="submit"
          className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <PlusCircleIcon />
          Add Expense
        </button>
      </form>
    </div>
  );
};

export default ExpenseForm;