import React, { useState } from 'react';
import { Saving, Category, View } from '../types';
import { TrashIcon, PencilIcon, ArrowLeftIcon } from './icons';

interface SavingsHistoryProps {
  savings: (Saving & { category: Category })[];
  categories: Category[];
  editSaving: (saving: Saving) => void;
  deleteSaving: (id: string) => void;
  setView: (view: View) => void;
}

const SavingsHistory: React.FC<SavingsHistoryProps> = ({ savings, categories, editSaving, deleteSaving, setView }) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editFormData, setEditFormData] = useState<Omit<Saving, 'id'>>({ amount: 0, categoryId: '', details: '', date: '' });

  const handleEditClick = (saving: Saving) => {
    setEditingId(saving.id);
    setEditFormData({
      amount: saving.amount,
      categoryId: saving.categoryId,
      details: saving.details,
      date: saving.date,
    });
  };

  const handleCancel = () => {
    setEditingId(null);
  };

  const handleSave = (id: string) => {
    editSaving({ id, ...editFormData });
    setEditingId(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: name === 'amount' ? parseFloat(value) || 0 : value }));
  };

  const EditForm = ({ saving }: { saving: Saving }) => (
    <div className="p-4 bg-teal-50 rounded-lg space-y-3">
        <h4 className="text-xl font-semibold text-teal-800">Editing Saving</h4>
        <div>
            <label className="text-sm font-medium text-teal-700">Amount</label>
            <input type="number" name="amount" value={editFormData.amount} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-base"/>
        </div>
        <div>
            <label className="text-sm font-medium text-teal-700">Category</label>
            <select name="categoryId" value={editFormData.categoryId} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-base">
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
        </div>
        <div>
            <label className="text-sm font-medium text-teal-700">Details</label>
            <input type="text" name="details" value={editFormData.details} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-base"/>
        </div>
        <div>
            <label className="text-sm font-medium text-teal-700">Date</label>
            <input type="date" name="date" value={editFormData.date} onChange={handleInputChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 sm:text-base"/>
        </div>
        <div className="flex gap-2 justify-end">
            <button onClick={handleCancel} className="px-3 py-1 bg-slate-200 text-slate-700 rounded-md hover:bg-slate-300">Cancel</button>
            <button onClick={() => handleSave(saving.id)} className="px-3 py-1 bg-teal-600 text-white rounded-md hover:bg-teal-700">Save</button>
        </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-4xl font-bold text-slate-800">Savings History</h2>
        <button
          onClick={() => setView('savings')}
          className="flex items-center gap-2 px-4 py-2 bg-slate-600 text-white text-lg font-medium rounded-md hover:bg-slate-700 transition-colors"
        >
          <ArrowLeftIcon />
          Back to Goals
        </button>
      </div>
      <div className="overflow-x-auto">
        {savings.length > 0 ? (
          <ul className="divide-y divide-slate-200">
            {savings.map(saving => (
              <li key={saving.id} className="py-4 px-2">
                {editingId === saving.id ? (
                    <EditForm saving={saving} />
                ) : (
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-lg font-semibold text-slate-900">
                              {saving.category.name}
                            </p>
                            <p className="text-lg text-slate-500">{saving.details || 'No details'}</p>
                          </div>
                        </div>
                        <div className="text-right flex items-center gap-2">
                            <div>
                                <p className="text-lg font-semibold text-slate-900">${saving.amount.toFixed(2)}</p>
                                <p className="text-lg text-slate-500">{saving.date}</p>
                            </div>
                            <div className="flex flex-col gap-1">
                                <button onClick={() => handleEditClick(saving)} className="p-2 text-slate-400 hover:text-blue-500 transition-colors rounded-full hover:bg-blue-100">
                                    <PencilIcon />
                                </button>
                                <button onClick={() => deleteSaving(saving.id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors rounded-full hover:bg-red-100">
                                    <TrashIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-slate-500 py-10 text-lg">No savings recorded yet.</p>
        )}
      </div>
    </div>
  );
};

export default SavingsHistory;