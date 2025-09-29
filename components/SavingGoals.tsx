import React, { useState, useMemo } from 'react';
import { Saving, Category, View } from '../types';
import { PlusCircleIcon, ListBulletIcon } from './icons';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, Label } from 'recharts';

interface SavingGoalsProps {
  savings: (Saving & { category: Category })[];
  categories: Category[];
  addSaving: (saving: Omit<Saving, 'id'>) => void;
  goal: number;
  setGoal: (goal: number) => void;
  setView: (view: View) => void;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-slate-300 rounded-md shadow-lg">
        <p className="font-bold text-slate-800 text-lg">{payload[0].name}</p>
        <p className="text-teal-600 text-lg">{`Saved: $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }
  return null;
};

const SavingGoals: React.FC<SavingGoalsProps> = ({ savings, categories, addSaving, goal, setGoal, setView }) => {
  const [amount, setAmount] = useState('');
  const [categoryId, setCategoryId] = useState(categories.length > 0 ? categories[0].id : '');
  const [details, setDetails] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const totalSaved = useMemo(() => savings.reduce((sum, s) => sum + s.amount, 0), [savings]);
  
  const chartData = useMemo(() => {
    const dataByCat = savings.reduce((acc, saving) => {
      const catName = saving.category.name;
      if (!acc[catName]) {
        acc[catName] = 0;
      }
      acc[catName] += saving.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return [{ name: 'Progress', ...dataByCat }];
  }, [savings]);

  const categoryTotals = useMemo(() => {
    const categoryMap = new Map<string, {name: string, color: string}>();
    categories.forEach(c => categoryMap.set(c.name, c));

    return Object.keys(chartData[0])
      .filter(key => key !== 'name')
      .map(catName => ({
        name: catName,
        color: categoryMap.get(catName)?.color || '#808080'
      }));
  }, [chartData, categories]);

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

    addSaving({
      amount: parseFloat(amount),
      categoryId,
      details,
      date,
    });
    
    setSuccess(`$${amount} saved successfully!`);
    setAmount('');
    setDetails('');
    setDate(new Date().toISOString().split('T')[0]);
    if (categories.length > 0) setCategoryId(categories[0].id);

    setTimeout(() => setSuccess(''), 3000);
  };

  return (
    <div className="space-y-6 bg-teal-50/50 p-6 rounded-lg shadow-inner">
      {/* Top Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-teal-200">
        <h2 className="text-4xl font-bold mb-4 text-teal-900">Saving Goals</h2>
        <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-teal-100 rounded-lg">
                <h3 className="text-xl font-semibold text-teal-700">Saved</h3>
                <p className="text-2xl font-bold text-teal-900">${totalSaved.toFixed(0)}</p>
            </div>
            <div className="text-center p-4 bg-teal-100 rounded-lg col-span-1">
                <label htmlFor="goal" className="text-xl font-semibold text-teal-700">Goal</label>
                <div className="mt-1 relative rounded-md shadow-sm">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-teal-600 text-xl font-bold">$</span>
                    <input
                      type="number"
                      id="goal"
                      value={goal}
                      onChange={(e) => setGoal(Number(e.target.value))}
                      className="block w-full text-center bg-transparent border-0 border-b-2 border-teal-300 focus:border-teal-500 focus:ring-0 text-2xl font-bold text-teal-900"
                      placeholder="1000"
                    />
                </div>
            </div>
        </div>
      </div>

      {/* Graph Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-teal-200">
        <h3 className="text-3xl font-semibold mb-4 text-teal-900">Progress</h3>
        <div style={{ width: '100%', height: 100 }}>
          <ResponsiveContainer>
            <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis type="number" domain={[0, dataMax => Math.max(dataMax, goal)]} tick={{ fill: 'currentColor', fontSize: 16 }} />
              <YAxis type="category" dataKey="name" hide={true} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(13, 148, 136, 0.1)' }}/>
              {categoryTotals.map(cat => (
                <Bar key={cat.name} dataKey={cat.name} stackId="a" fill={cat.color} />
              ))}
              <ReferenceLine x={goal} stroke="red" strokeWidth={2} strokeDasharray="5 5">
                 <Label value="Goal" offset={10} position="insideTopRight" fill="red" fontSize={16} />
              </ReferenceLine>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-teal-200">
        <h3 className="text-3xl font-semibold mb-4 text-teal-900">Add to Savings</h3>
         <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="amount" className="block text-lg font-medium text-teal-700">Amount</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                  <span className="text-slate-500 sm:text-lg">$</span>
                </div>
                <input
                  type="number"
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="block w-full rounded-md border-slate-300 pl-7 pr-2 py-2 focus:border-teal-500 focus:ring-teal-500 sm:text-lg"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            <div>
              <label htmlFor="category" className="block text-lg font-medium text-teal-700">Category</label>
              <select
                id="category"
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 py-2 pl-3 pr-10 text-xl focus:border-teal-500 focus:outline-none focus:ring-teal-500 sm:text-lg"
              >
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="details" className="block text-lg font-medium text-teal-700">Details (Optional)</label>
              <input
                type="text"
                id="details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-lg"
                placeholder="e.g., Birthday gift fund"
              />
            </div>

            <div>
              <label htmlFor="date" className="block text-lg font-medium text-teal-700">Date</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-lg"
              />
            </div>
            
            {error && <p className="text-lg text-red-500">{error}</p>}
            {success && <p className="text-lg text-green-500">{success}</p>}

            <div className="flex flex-col gap-2">
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  <PlusCircleIcon />
                  Add Savings
                </button>
                 <button
                    type="button"
                    onClick={() => setView('savingsHistory')}
                    className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-teal-600 text-teal-600 rounded-md shadow-sm text-lg font-medium hover:bg-teal-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                    <ListBulletIcon />
                    View & Edit Savings
                </button>
            </div>
      </form>
      </div>
    </div>
  );
};

export default SavingGoals;