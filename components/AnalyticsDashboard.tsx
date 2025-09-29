import React, { useState, useMemo } from 'react';
import { Expense, Category } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsDashboardProps {
  expenses: (Expense & { category: Category })[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-2 border border-slate-300 rounded-md shadow-lg">
        <p className="font-bold text-slate-800 text-lg">{`${label}`}</p>
        <p className="text-indigo-600 text-lg">{`Total : $${payload[0].value.toFixed(2)}`}</p>
      </div>
    );
  }

  return null;
};

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ expenses }) => {
  const today = new Date();
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(today.getDate() - 30);

  const [startDate, setStartDate] = useState(thirtyDaysAgo.toISOString().split('T')[0]);
  const [endDate, setEndDate] = useState(today.toISOString().split('T')[0]);

  const filteredExpenses = useMemo(() => {
    return expenses.filter(expense => {
      const expenseDate = new Date(expense.date);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999); // Include the whole end day
      return expenseDate >= start && expenseDate <= end;
    });
  }, [expenses, startDate, endDate]);

  const chartData = useMemo(() => {
    const dataByCategory: { [key: string]: { name: string; total: number; fill: string } } = {};
    
    filteredExpenses.forEach(expense => {
      const categoryName = expense.category.name;
      if (!dataByCategory[categoryName]) {
        dataByCategory[categoryName] = { name: categoryName, total: 0, fill: expense.category.color };
      }
      dataByCategory[categoryName].total += expense.amount;
    });
    
    return Object.values(dataByCategory).sort((a,b) => b.total - a.total);
  }, [filteredExpenses]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold mb-4 text-slate-800">Spending Analytics</h2>
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div>
            <label htmlFor="startDate" className="block text-lg font-medium text-slate-600">Start Date</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg"
            />
          </div>
          <div>
            <label htmlFor="endDate" className="block text-lg font-medium text-slate-600">End Date</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg"
            />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-3xl font-semibold mb-4 text-slate-800">Spending by Category</h3>
        {chartData.length > 0 ? (
          <div style={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.2)" />
                <XAxis dataKey="name" tick={{ fill: 'currentColor', fontSize: 16 }} />
                <YAxis tickFormatter={(value) => `$${value}`} tick={{ fill: 'currentColor', fontSize: 16 }}/>
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(200, 200, 200, 0.1)' }} />
                <Bar dataKey="total" name="Total Spent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className="text-center text-slate-500 py-10 text-lg">No expenses found for the selected period.</p>
        )}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;