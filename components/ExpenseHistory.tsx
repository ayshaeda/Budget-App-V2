import React from 'react';
import { Expense, Category } from '../types';
import { TrashIcon, ArrowDownTrayIcon } from './icons';

interface ExpenseHistoryProps {
  expenses: (Expense & { category: Category })[];
  deleteExpense: (id: string) => void;
}

const ExpenseHistory: React.FC<ExpenseHistoryProps> = ({ expenses, deleteExpense }) => {

  const exportToCSV = () => {
    const headers = ['Date', 'Category', 'Amount', 'Details'];
    const rows = expenses.map(e => 
      [e.date, e.category.name, e.amount.toString(), `"${e.details.replace(/"/g, '""')}"`]
    );

    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "budget_app_expenses.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold text-slate-800">Expense History</h2>
        <button
          onClick={exportToCSV}
          disabled={expenses.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white text-lg font-medium rounded-md hover:bg-green-700 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowDownTrayIcon />
          Export CSV
        </button>
      </div>
      <div className="overflow-x-auto">
        {expenses.length > 0 ? (
          <ul className="divide-y divide-slate-200">
            {expenses.map(expense => (
              <li key={expense.id} className="flex items-center justify-between py-4 px-2 hover:bg-slate-50 rounded-md">
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center" style={{backgroundColor: expense.category.color, color: 'white'}}>
                    <span className="font-bold text-2xl">${expense.amount.toFixed(0)[0]}</span>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-slate-900">
                      {expense.category.name}
                    </p>
                    <p className="text-lg text-slate-500">{expense.details || 'No details'}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                    <div>
                        <p className="text-lg font-semibold text-slate-900">${expense.amount.toFixed(2)}</p>
                        <p className="text-lg text-slate-500">{expense.date}</p>
                    </div>
                    <button onClick={() => deleteExpense(expense.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-100">
                        <TrashIcon />
                    </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-500 py-10 text-lg">No expenses recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default ExpenseHistory;