import { create } from 'zustand';
import type { TransactionFilters, ReportFilters } from '@/types/common';

interface UIState {
  // Sidebar
  sidebarCollapsed: boolean;
  
  // Modals and drawers
  transactionDrawerOpen: boolean;
  editingTransactionId: string | null;
  
  // Filters
  transactionFilters: TransactionFilters;
  reportFilters: ReportFilters;
  
  // Bulk selection
  selectedTransactionIds: string[];
  
  // Theme
  theme: 'light' | 'dark' | 'system';
}

interface UIActions {
  // Sidebar
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  
  // Transaction drawer
  openTransactionDrawer: (transactionId?: string) => void;
  closeTransactionDrawer: () => void;
  
  // Filters
  setTransactionFilters: (filters: Partial<TransactionFilters>) => void;
  clearTransactionFilters: () => void;
  setReportFilters: (filters: Partial<ReportFilters>) => void;
  
  // Bulk selection
  toggleTransactionSelection: (id: string) => void;
  selectAllTransactions: (ids: string[]) => void;
  clearTransactionSelection: () => void;
  
  // Theme
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
}

type UIStore = UIState & UIActions;

const getDefaultReportFilters = (): ReportFilters => {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  
  return {
    dateFrom: startOfMonth.toISOString().split('T')[0],
    dateTo: endOfMonth.toISOString().split('T')[0],
    granularity: 'day',
  };
};

export const useUIStore = create<UIStore>((set, get) => ({
  // State
  sidebarCollapsed: false,
  transactionDrawerOpen: false,
  editingTransactionId: null,
  transactionFilters: {},
  reportFilters: getDefaultReportFilters(),
  selectedTransactionIds: [],
  theme: 'system',

  // Actions
  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }));
  },

  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed });
  },

  openTransactionDrawer: (transactionId) => {
    set({ 
      transactionDrawerOpen: true, 
      editingTransactionId: transactionId || null 
    });
  },

  closeTransactionDrawer: () => {
    set({ 
      transactionDrawerOpen: false, 
      editingTransactionId: null 
    });
  },

  setTransactionFilters: (filters) => {
    set((state) => ({
      transactionFilters: { ...state.transactionFilters, ...filters }
    }));
  },

  clearTransactionFilters: () => {
    set({ transactionFilters: {} });
  },

  setReportFilters: (filters) => {
    set((state) => ({
      reportFilters: { ...state.reportFilters, ...filters }
    }));
  },

  toggleTransactionSelection: (id) => {
    set((state) => {
      const isSelected = state.selectedTransactionIds.includes(id);
      return {
        selectedTransactionIds: isSelected
          ? state.selectedTransactionIds.filter(i => i !== id)
          : [...state.selectedTransactionIds, id]
      };
    });
  },

  selectAllTransactions: (ids) => {
    set({ selectedTransactionIds: ids });
  },

  clearTransactionSelection: () => {
    set({ selectedTransactionIds: [] });
  },

  setTheme: (theme) => {
    set({ theme });
    // Apply theme to document
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      document.documentElement.classList.toggle('dark', prefersDark);
    }
  },
}));