export interface Expense {
  id: string;
  amount: number;
  categoryId: string;
  details: string;
  date: string; // YYYY-MM-DD
}

export interface Saving {
  id: string;
  amount: number;
  categoryId: string;
  details: string;
  date: string; // YYYY-MM-DD
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

export type View = 'home' | 'analytics' | 'history' | 'categories' | 'savings';