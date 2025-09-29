import React from 'react';
import { View } from '../types';
import { HomeIcon, ChartBarIcon, ListBulletIcon, TagIcon, PiggyBankIcon } from './icons';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
}

const NavButton: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-3 py-2 rounded-md text-lg font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-indigo-600 text-white'
        : 'text-slate-500 hover:bg-slate-200'
    }`}
  >
    {icon}
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-3xl sm:text-4xl font-bold text-indigo-600">BudgetApp</h1>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <nav className="flex gap-1 sm:gap-2">
              <NavButton label="Add Expense" icon={<HomeIcon />} isActive={currentView === 'home'} onClick={() => setView('home')} />
              <NavButton label="Analytics" icon={<ChartBarIcon />} isActive={currentView === 'analytics'} onClick={() => setView('analytics')} />
              <NavButton label="History" icon={<ListBulletIcon />} isActive={currentView === 'history'} onClick={() => setView('history')} />
              <NavButton label="Categories" icon={<TagIcon />} isActive={currentView === 'categories'} onClick={() => setView('categories')} />
              <NavButton label="Saving Goals" icon={<PiggyBankIcon />} isActive={currentView === 'savings'} onClick={() => setView('savings')} />
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;