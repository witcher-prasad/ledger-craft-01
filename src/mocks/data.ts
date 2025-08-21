import { v7 as uuidv7 } from 'uuid';
import { format, subDays, addDays, startOfMonth, endOfMonth } from 'date-fns';
import type { 
  Account, 
  Category, 
  Transaction, 
  Budget, 
  Goal, 
  RecurringRule, 
  Tag,
  Merchant,
  User
} from '@/types/common';

export const mockUser: User = {
  id: uuidv7(),
  email: 'john@example.com',
  displayName: 'John Doe',
  defaultCurrency: 'USD',
  createdAt: new Date().toISOString(),
};

export const mockAccounts: Account[] = [
  {
    id: '01H8QZX5Z3J5M9N7P8R4S6T2',
    name: 'Main Checking',
    type: 'bank',
    currency: 'USD',
    startingBalance: 5000.00,
    currentBalance: 3245.67,
    createdAt: subDays(new Date(), 30).toISOString(),
  },
  {
    id: '01H8QZY7A9B2C3D4E5F6G7H8',
    name: 'Credit Card',
    type: 'card',
    currency: 'USD',
    startingBalance: 0,
    currentBalance: -1267.89,
    createdAt: subDays(new Date(), 25).toISOString(),
  },
  {
    id: '01H8QZZ8B0C1D2E3F4G5H6I7',
    name: 'Cash Wallet',
    type: 'cash',
    currency: 'USD',
    startingBalance: 200.00,
    currentBalance: 89.50,
    createdAt: subDays(new Date(), 20).toISOString(),
  },
  {
    id: '01H8R0A0C1D2E3F4G5H6I7J8',
    name: 'Savings',
    type: 'bank',
    currency: 'USD',
    startingBalance: 10000.00,
    currentBalance: 12456.78,
    createdAt: subDays(new Date(), 45).toISOString(),
  },
];

export const mockCategories: Category[] = [
  // Expense categories
  {
    id: '01H8R1A1B2C3D4E5F6G7H8I9',
    name: 'Food & Dining',
    type: 'expense',
    color: '#FF6B6B',
    icon: '🍽️',
  },
  {
    id: '01H8R1B2C3D4E5F6G7H8I9J0',
    name: 'Transportation',
    type: 'expense', 
    color: '#4ECDC4',
    icon: '🚗',
  },
  {
    id: '01H8R1C3D4E5F6G7H8I9J0K1',
    name: 'Shopping',
    type: 'expense',
    color: '#45B7D1',
    icon: '🛍️',
  },
  {
    id: '01H8R1D4E5F6G7H8I9J0K1L2',
    name: 'Bills & Utilities',
    type: 'expense',
    color: '#FFA07A',
    icon: '📋',
  },
  {
    id: '01H8R1E5F6G7H8I9J0K1L2M3',
    name: 'Entertainment',
    type: 'expense',
    color: '#98D8C8',
    icon: '🎬',
  },
  {
    id: '01H8R1F6G7H8I9J0K1L2M3N4',
    name: 'Healthcare',
    type: 'expense',
    color: '#F7DC6F',
    icon: '🏥',
  },
  {
    id: '01H8R1G7H8I9J0K1L2M3N4O5',
    name: 'Education',
    type: 'expense',
    color: '#BB8FCE',
    icon: '📚',
  },
  // Income categories
  {
    id: '01H8R1H8I9J0K1L2M3N4O5P6',
    name: 'Salary',
    type: 'income',
    color: '#58D68D',
    icon: '💰',
  },
  {
    id: '01H8R1I9J0K1L2M3N4O5P6Q7',
    name: 'Freelance',
    type: 'income',
    color: '#5DADE2',
    icon: '💼',
  },
  {
    id: '01H8R1J0K1L2M3N4O5P6Q7R8',
    name: 'Investment',
    type: 'income',
    color: '#F8C471',
    icon: '📈',
  },
];

export const mockMerchants: Merchant[] = [
  {
    id: '01H8R2A1B2C3D4E5F6G7H8I9',
    name: 'Starbucks',
    normalizedName: 'starbucks',
  },
  {
    id: '01H8R2B2C3D4E5F6G7H8I9J0',
    name: 'Amazon',
    normalizedName: 'amazon',
  },
  {
    id: '01H8R2C3D4E5F6G7H8I9J0K1',
    name: 'Shell Gas Station',
    normalizedName: 'shell',
  },
  {
    id: '01H8R2D4E5F6G7H8I9J0K1L2',
    name: 'Target',
    normalizedName: 'target',
  },
  {
    id: '01H8R2E5F6G7H8I9J0K1L2M3',
    name: 'Netflix',
    normalizedName: 'netflix',
  },
];

export const mockTags: Tag[] = [
  { id: '01H8R3A1B2C3D4E5F6G7H8I9', name: 'work-lunch', color: '#FF6B6B' },
  { id: '01H8R3B2C3D4E5F6G7H8I9J0', name: 'recurring', color: '#4ECDC4' },
  { id: '01H8R3C3D4E5F6G7H8I9J0K1', name: 'business', color: '#45B7D1' },
  { id: '01H8R3D4E5F6G7H8I9J0K1L2', name: 'emergency', color: '#FFA07A' },
  { id: '01H8R3E5F6G7H8I9J0K1L2M3', name: 'vacation', color: '#98D8C8' },
];

// Generate transactions for the last 90 days
export const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = [];
  const accountIds = mockAccounts.map(a => a.id);
  const categoryIds = mockCategories.map(c => c.id);
  const merchantIds = mockMerchants.map(m => m.id);
  const tagIds = mockTags.map(t => t.id);

  for (let i = 0; i < 150; i++) {
    const randomDays = Math.floor(Math.random() * 90);
    const date = subDays(new Date(), randomDays);
    const isIncome = Math.random() < 0.2; // 20% chance of income
    const type = isIncome ? 'income' : 'expense';
    
    let amount: number;
    if (isIncome) {
      amount = Math.random() * 5000 + 1000; // Income: $1000-$6000
    } else {
      amount = Math.random() * 500 + 5; // Expenses: $5-$505
    }

    const availableCategories = mockCategories.filter(c => c.type === type);
    const categoryId = availableCategories[Math.floor(Math.random() * availableCategories.length)]?.id;

    const transaction: Transaction = {
      id: uuidv7(),
      accountId: accountIds[Math.floor(Math.random() * accountIds.length)],
      type,
      amount: Math.round(amount * 100) / 100,
      currency: 'USD',
      categoryId,
      merchantId: Math.random() < 0.7 ? merchantIds[Math.floor(Math.random() * merchantIds.length)] : undefined,
      notes: Math.random() < 0.3 ? `Transaction note ${i + 1}` : undefined,
      tags: Math.random() < 0.4 ? [tagIds[Math.floor(Math.random() * tagIds.length)]] : undefined,
      date: date.toISOString(),
      createdAt: date.toISOString(),
      updatedAt: date.toISOString(),
    };

    transactions.push(transaction);
  }

  return transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const mockTransactions = generateMockTransactions();

export const mockBudgets: Budget[] = [
  {
    id: uuidv7(),
    month: format(new Date(), 'yyyy-MM'),
    currency: 'USD',
    rolloverDefault: true,
    items: [
      {
        id: uuidv7(),
        categoryId: mockCategories.find(c => c.name === 'Food & Dining')!.id,
        limit: 800.00,
        rollover: true,
        spent: 645.32,
      },
      {
        id: uuidv7(),
        categoryId: mockCategories.find(c => c.name === 'Transportation')!.id,
        limit: 400.00,
        rollover: false,
        spent: 287.50,
      },
      {
        id: uuidv7(),
        categoryId: mockCategories.find(c => c.name === 'Shopping')!.id,
        limit: 600.00,
        rollover: true,
        spent: 734.21,
      },
      {
        id: uuidv7(),
        categoryId: mockCategories.find(c => c.name === 'Entertainment')!.id,
        limit: 300.00,
        rollover: false,
        spent: 156.78,
      },
    ],
  },
];

export const mockGoals: Goal[] = [
  {
    id: uuidv7(),
    name: 'Emergency Fund',
    targetAmount: 10000.00,
    savedAmount: 7250.00,
    targetDate: addDays(new Date(), 180).toISOString().split('T')[0],
    accountId: mockAccounts.find(a => a.name === 'Savings')!.id,
    description: 'Build a 6-month emergency fund',
  },
  {
    id: uuidv7(),
    name: 'Vacation to Japan',
    targetAmount: 5000.00,
    savedAmount: 2100.00,
    targetDate: addDays(new Date(), 365).toISOString().split('T')[0],
    description: 'Save for a 2-week trip to Japan',
  },
  {
    id: uuidv7(),
    name: 'New Laptop',
    targetAmount: 2500.00,
    savedAmount: 1800.00,
    targetDate: addDays(new Date(), 90).toISOString().split('T')[0],
    description: 'Upgrade to a new MacBook Pro',
  },
];

export const mockRecurringRules: RecurringRule[] = [
  {
    id: uuidv7(),
    name: 'Monthly Salary',
    frequency: 'monthly',
    enabled: true,
    nextRun: startOfMonth(addDays(new Date(), 30)).toISOString(),
    template: {
      accountId: mockAccounts[0].id,
      type: 'income',
      amount: 5000.00,
      currency: 'USD',
      categoryId: mockCategories.find(c => c.name === 'Salary')!.id,
      notes: 'Monthly salary deposit',
    },
    description: 'Regular monthly salary',
  },
  {
    id: uuidv7(),
    name: 'Netflix Subscription',
    frequency: 'monthly',
    enabled: true,
    nextRun: addDays(new Date(), 15).toISOString(),
    template: {
      accountId: mockAccounts[1].id,
      type: 'expense',
      amount: 15.99,
      currency: 'USD',
      categoryId: mockCategories.find(c => c.name === 'Entertainment')!.id,
      merchantId: mockMerchants.find(m => m.name === 'Netflix')!.id,
      notes: 'Monthly Netflix subscription',
      tags: ['recurring', 'entertainment'],
    },
    description: 'Netflix monthly subscription',
  },
  {
    id: uuidv7(),
    name: 'Rent Payment',
    frequency: 'monthly',
    enabled: true,
    nextRun: startOfMonth(addDays(new Date(), 30)).toISOString(),
    template: {
      accountId: mockAccounts[0].id,
      type: 'expense',
      amount: 1500.00,
      currency: 'USD',
      categoryId: mockCategories.find(c => c.name === 'Bills & Utilities')!.id,
      notes: 'Monthly rent payment',
      tags: ['recurring'],
    },
    description: 'Monthly rent payment',
  },
];