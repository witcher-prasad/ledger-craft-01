import apiClient from '@/lib/axios';
import type { KPI, ChartDataPoint, CategorySummary, RecurringRule, ReportFilters } from '@/types/common';

export interface DashboardOverview {
  kpis: KPI[];
  trend: ChartDataPoint[];
  categories: CategorySummary[];
  upcomingBills: RecurringRule[];
}

export const dashboardAPI = {
  getOverview: async (filters?: Partial<ReportFilters>): Promise<DashboardOverview> => {
    const params = new URLSearchParams();
    
    if (filters?.dateFrom) params.append('from', filters.dateFrom);
    if (filters?.dateTo) params.append('to', filters.dateTo);
    
    const response = await apiClient.get(`/reports/overview?${params.toString()}`);
    return response.data;
  },
};