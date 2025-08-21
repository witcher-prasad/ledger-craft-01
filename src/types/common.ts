export type UUID = string;
export type CurrencyCode = 'USD' | 'EUR' | 'LKR' | 'GBP' | 'INR' | 'JPY' | 'CAD' | 'AUD';
export type TxType = 'expense' | 'income' | 'transfer';
export type AccountType = 'cash' | 'bank' | 'card' | 'wallet';
export type CategoryType = 'expense' | 'income';
export type RecurringFrequency = 'daily' | 'weekly' | 'monthly' | 'yearly' | 'custom';

export interface Account {
  id: UUID;
  name: string;
  type: AccountType;
  currency: CurrencyCode;
  startingBalance: number;
  currentBalance: number;
  archived?: boolean;
  createdAt: string;
}

export interface Category {
  id: UUID;
  name: string;
  parentId?: UUID | null;
  color?: string;
  icon?: string;
  type: CategoryType;
}

export interface Merchant {
  id: UUID;
  name: string;
  normalizedName: string;
}

export interface Transaction {
  id: UUID;
  accountId: UUID;
  type: TxType;
  amount: number;
  currency: CurrencyCode;
  categoryId?: UUID | null;
  merchantId?: UUID | null;
  notes?: string;
  tags?: string[];
  date: string;
  transferAccountId?: UUID | null;
  attachmentUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: UUID;
  month: string; // YYYY-MM format
  currency: CurrencyCode;
  items: BudgetItem[];
  rolloverDefault?: boolean;
}

export interface BudgetItem {
  id: UUID;
  categoryId: UUID;
  limit: number;
  rollover?: boolean;
  spent?: number; // calculated field
}

export interface Goal {
  id: UUID;
  name: string;
  targetAmount: number;
  targetDate?: string;
  savedAmount: number;
  accountId?: UUID;
  description?: string;
}

export interface RecurringRule {
  id: UUID;
  name: string;
  frequency: RecurringFrequency;
  cron?: string;
  template: Partial<Transaction>;
  nextRun: string;
  enabled: boolean;
  description?: string;
}

export interface Tag {
  id: UUID;
  name: string;
  color?: string;
}

export interface KPI {
  label: string;
  value: number;
  diff?: number;
  diffPercent?: number;
  currency?: CurrencyCode;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
  category?: string;
}

export interface CategorySummary {
  categoryId: UUID;
  categoryName: string;
  amount: number;
  percentage: number;
  color?: string;
  transactionCount: number;
}

export interface User {
  id: UUID;
  email: string;
  displayName?: string;
  defaultCurrency: CurrencyCode;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface ApiError {
  type: string;
  title: string;
  status: number;
  detail?: string;
  errors?: Record<string, string[]>;
}

// Filter types
export interface TransactionFilters {
  dateFrom?: string;
  dateTo?: string;
  accountIds?: UUID[];
  categoryIds?: UUID[];
  type?: TxType;
  tags?: string[];
  merchantIds?: UUID[];
  search?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  accountIds?: UUID[];
  categoryIds?: UUID[];
  granularity?: 'day' | 'week' | 'month' | 'quarter' | 'year';
}