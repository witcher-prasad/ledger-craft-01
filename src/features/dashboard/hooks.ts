import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth } from 'date-fns';
import { dashboardAPI } from './api';
import type { ReportFilters } from '@/types/common';

export const useDashboardOverview = (filters?: Partial<ReportFilters>) => {
  // Default to current month if no filters provided
  const defaultFilters: ReportFilters = {
    dateFrom: format(startOfMonth(new Date()), 'yyyy-MM-dd'),
    dateTo: format(endOfMonth(new Date()), 'yyyy-MM-dd'),
    ...filters,
  };

  return useQuery({
    queryKey: ['dashboard', 'overview', defaultFilters],
    queryFn: () => dashboardAPI.getOverview(defaultFilters),
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};