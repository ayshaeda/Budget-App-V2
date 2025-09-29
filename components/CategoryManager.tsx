import React, { useState } from 'react';
import { Category } from '../types';
import { TrashIcon, PlusIcon } from './icons';

interface CategoryManagerProps {
  categories: Category[];
  addCategory: (category: Omit<Category, 'id'>) => void;
  deleteCategory: (id: string) => void;
}

const PRESET_COLORS = [
  '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
  '#E7E9ED', '#83EAF1', '#63A4FF', '#F47A7A', '#A3A1FB', '#74E291',
];

const CategoryManager: React.FC<CategoryManagerProps> = ({ categories, addCategory, deleteCategory }) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryColor, setNewCategoryColor] = useState(PRESET_COLORS[0]);
  const [error, setError] = useState('');

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) {
      setError('Category name cannot be empty.');
      return;
    }
    if(categories.some(cat => cat.name.toLowerCase() === newCategoryName.trim().toLowerCase())) {
        setError('Category with this name already exists.');
        return;
    }
    setError('');
    addCategory({ name: newCategoryName.trim(), color: newCategoryColor });
    setNewCategoryName('');
    setNewCategoryColor(PRESET_COLORS[0]);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold mb-4 text-slate-800">Add New Category</h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label htmlFor="categoryName" className="block text-lg font-medium text-slate-600">Category Name</label>
            <input
              type="text"
              id="categoryName"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-lg"
              placeholder="e.g., Groceries"
            />
          </div>
          <div>
            <label className="block text-lg font-medium text-slate-600">Color</label>
            <div className="mt-2 grid grid-cols-6 gap-2">
              {PRESET_COLORS.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setNewCategoryColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-transform transform hover:scale-110 ${newCategoryColor === color ? 'border-indigo-500 ring-2 ring-indigo-500' : 'border-transparent'}`}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>
           {error && <p className="text-lg text-red-500">{error}</p>}
          <button
            type="submit"
            className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-transparent rounded-md shadow-sm text-lg font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <PlusIcon /> Add Category
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-4xl font-bold mb-4 text-slate-800">Existing Categories</h2>
        <ul className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {categories.map(category => (
            <li key={category.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-md">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full" style={{ backgroundColor: category.color }}></span>
                <span className="text-lg font-medium">{category.name}</span>
              </div>
              <button onClick={() => deleteCategory(category.id)} className="text-slate-400 hover:text-red-500 transition-colors">
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default CategoryManager;