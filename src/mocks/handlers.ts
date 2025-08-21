import { http, HttpResponse } from 'msw';
import { format, addDays, startOfMonth } from 'date-fns';
import type { 
  Account, 
  Transaction, 
  Category, 
  Budget, 
  Goal, 
  RecurringRule, 
  Tag, 
  Merchant,
  User,
  AuthTokens,
  KPI,
  CategorySummary,
  ChartDataPoint
} from '@/types/common';
import { 
  mockUser, 
  mockAccounts, 
  mockCategories, 
  mockTransactions, 
  mockBudgets, 
  mockGoals, 
  mockRecurringRules, 
  mockTags, 
  mockMerchants 
} from './data';

// Helper to calculate KPIs from transactions
const calculateKPIs = (transactions: Transaction[]): KPI[] => {
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  
  const thisMonthTxns = transactions.filter(
    tx => new Date(tx.date) >= monthStart && new Date(tx.date) <= currentMonth
  );
  
  const expenses = thisMonthTxns.filter(tx => tx.type === 'expense');
  const income = thisMonthTxns.filter(tx => tx.type === 'income');
  
  const totalExpense = expenses.reduce((sum, tx) => sum + tx.amount, 0);
  const totalIncome = income.reduce((sum, tx) => sum + tx.amount, 0);
  const net = totalIncome - totalExpense;
  
  // Calculate budget remaining (mock)
  const budgetLimit = mockBudgets[0]?.items.reduce((sum, item) => sum + item.limit, 0) || 2000;
  const budgetRemaining = budgetLimit - totalExpense;
  
  const savingsRate = totalIncome > 0 ? (net / totalIncome) * 100 : 0;

  return [
    {
      label: 'This Month Spend',
      value: totalExpense,
      currency: 'USD',
      trend: totalExpense > 1500 ? 'up' : 'down',
      diff: -234.56,
      diffPercent: -12.5,
    },
    {
      label: 'Income',
      value: totalIncome,
      currency: 'USD', 
      trend: 'up',
      diff: 500.00,
      diffPercent: 11.2,
    },
    {
      label: 'Net Income',
      value: net,
      currency: 'USD',
      trend: net > 0 ? 'up' : 'down',
      diff: net - 890.44,
      diffPercent: net > 0 ? 15.3 : -8.7,
    },
    {
      label: 'Budget Remaining',
      value: budgetRemaining,
      currency: 'USD',
      trend: budgetRemaining > 0 ? 'up' : 'down',
      diff: budgetRemaining - 456.78,
      diffPercent: budgetRemaining > 500 ? 23.1 : -18.9,
    },
    {
      label: 'Savings Rate',
      value: savingsRate,
      trend: savingsRate > 20 ? 'up' : 'down',
      diff: 5.2,
      diffPercent: 12.4,
    },
  ];
};

export const handlers = [
  // Auth endpoints
  http.post('/api/v1/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string };
    
    if (body.email === 'john@example.com' && body.password === 'password') {
      const tokens: AuthTokens = {
        accessToken: 'mock-access-token-' + Date.now(),
        refreshToken: 'mock-refresh-token-' + Date.now(),
        expiresAt: addDays(new Date(), 1).toISOString(),
      };
      
      return HttpResponse.json({ user: mockUser, tokens });
    }
    
    return HttpResponse.json(
      { type: 'validation', title: 'Invalid credentials', status: 401 },
      { status: 401 }
    );
  }),

  http.post('/api/v1/auth/register', async ({ request }) => {
    const body = await request.json() as { email: string; displayName?: string; password: string };
    const newUser = { ...mockUser, email: body.email, displayName: body.displayName };
    const tokens: AuthTokens = {
      accessToken: 'mock-access-token-' + Date.now(),
      refreshToken: 'mock-refresh-token-' + Date.now(),
      expiresAt: addDays(new Date(), 1).toISOString(),
    };
    
    return HttpResponse.json({ user: newUser, tokens });
  }),

  http.get('/api/v1/me', () => {
    return HttpResponse.json(mockUser);
  }),

  // Accounts
  http.get('/api/v1/accounts', () => {
    return HttpResponse.json({ data: mockAccounts });
  }),

  http.post('/api/v1/accounts', async ({ request }) => {
    const body = await request.json() as Partial<Account>;
    const newAccount: Account = {
      id: 'new-account-' + Date.now(),
      name: body.name || 'New Account',
      type: body.type || 'bank',
      currency: body.currency || 'USD',
      startingBalance: body.startingBalance || 0,
      currentBalance: body.currentBalance || body.startingBalance || 0,
      createdAt: new Date().toISOString(),
    };
    return HttpResponse.json(newAccount);
  }),

  // Categories
  http.get('/api/v1/categories', () => {
    return HttpResponse.json({ data: mockCategories });
  }),

  // Transactions
  http.get('/api/v1/transactions', ({ request }) => {
    const url = new URL(request.url);
    const page = parseInt(url.searchParams.get('page') || '1');
    const pageSize = parseInt(url.searchParams.get('pageSize') || '20');
    const type = url.searchParams.get('type');
    const accountId = url.searchParams.get('accountId');
    const categoryId = url.searchParams.get('categoryId');
    
    let filteredTransactions = [...mockTransactions];
    
    if (type) {
      filteredTransactions = filteredTransactions.filter(tx => tx.type === type);
    }
    if (accountId) {
      filteredTransactions = filteredTransactions.filter(tx => tx.accountId === accountId);
    }
    if (categoryId) {
      filteredTransactions = filteredTransactions.filter(tx => tx.categoryId === categoryId);
    }
    
    const total = filteredTransactions.length;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;
    const data = filteredTransactions.slice(start, end);
    
    return HttpResponse.json({
      data,
      pagination: {
        page,
        pageSize,
        total,
        hasNext: end < total,
        hasPrev: page > 1,
      },
    });
  }),

  http.post('/api/v1/transactions', async ({ request }) => {
    const body = await request.json() as Partial<Transaction>;
    const newTransaction: Transaction = {
      id: 'new-tx-' + Date.now(),
      accountId: body.accountId!,
      type: body.type || 'expense',
      amount: body.amount || 0,
      currency: body.currency || 'USD',
      categoryId: body.categoryId,
      merchantId: body.merchantId,
      notes: body.notes,
      tags: body.tags,
      date: body.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    return HttpResponse.json(newTransaction);
  }),

  // Budgets
  http.get('/api/v1/budgets', () => {
    return HttpResponse.json({ data: mockBudgets });
  }),

  // Goals
  http.get('/api/v1/goals', () => {
    return HttpResponse.json({ data: mockGoals });
  }),

  // Recurring rules
  http.get('/api/v1/recurring', () => {
    return HttpResponse.json({ data: mockRecurringRules });
  }),

  // Tags
  http.get('/api/v1/tags', () => {
    return HttpResponse.json({ data: mockTags });
  }),

  // Merchants
  http.get('/api/v1/merchants', () => {
    return HttpResponse.json({ data: mockMerchants });
  }),

  // Reports and analytics
  http.get('/api/v1/reports/overview', ({ request }) => {
    const url = new URL(request.url);
    const from = url.searchParams.get('from');
    const to = url.searchParams.get('to');
    
    const kpis = calculateKPIs(mockTransactions);
    
    // Generate trend data for the last 30 days
    const trendData: ChartDataPoint[] = [];
    for (let i = 29; i >= 0; i--) {
      const date = format(addDays(new Date(), -i), 'yyyy-MM-dd');
      const dayTransactions = mockTransactions.filter(
        tx => tx.date.startsWith(date) && tx.type === 'expense'
      );
      const dailySpend = dayTransactions.reduce((sum, tx) => sum + tx.amount, 0);
      
      trendData.push({
        date,
        value: Math.round(dailySpend * 100) / 100,
        label: format(addDays(new Date(), -i), 'MMM dd'),
      });
    }
    
    // Category breakdown
    const categoryData: CategorySummary[] = mockCategories
      .filter(cat => cat.type === 'expense')
      .map(category => {
        const categoryTxns = mockTransactions.filter(
          tx => tx.categoryId === category.id && tx.type === 'expense'
        );
        const amount = categoryTxns.reduce((sum, tx) => sum + tx.amount, 0);
        const totalExpense = mockTransactions
          .filter(tx => tx.type === 'expense')
          .reduce((sum, tx) => sum + tx.amount, 0);
        
        return {
          categoryId: category.id,
          categoryName: category.name,
          amount: Math.round(amount * 100) / 100,
          percentage: totalExpense > 0 ? Math.round((amount / totalExpense) * 100 * 100) / 100 : 0,
          color: category.color,
          transactionCount: categoryTxns.length,
        };
      })
      .filter(cat => cat.amount > 0)
      .sort((a, b) => b.amount - a.amount);
    
    return HttpResponse.json({
      kpis,
      trend: trendData,
      categories: categoryData,
      upcomingBills: mockRecurringRules.slice(0, 3),
    });
  }),

  // Catch all for unhandled requests
  http.all('*', ({ request }) => {
    console.warn(`Unhandled ${request.method} request to ${request.url}`);
    return HttpResponse.json(
      { type: 'not-found', title: 'Endpoint not found', status: 404 },
      { status: 404 }
    );
  }),
];