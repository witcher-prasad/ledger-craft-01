import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { KPI } from '@/types/common';

interface KPICardProps {
  kpi: KPI;
}

export function KPICard({ kpi }: KPICardProps) {
  const formatValue = (value: number, currency?: string) => {
    if (currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(value);
    }
    
    if (kpi.label.includes('Rate')) {
      return `${value.toFixed(1)}%`;
    }
    
    return value.toLocaleString();
  };

  const formatDiff = (diff: number, currency?: string) => {
    const absValue = Math.abs(diff);
    if (currency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(absValue);
    }
    return absValue.toLocaleString();
  };

  const getTrendIcon = () => {
    switch (kpi.trend) {
      case 'up':
        return <ArrowUpIcon className="h-3 w-3" />;
      case 'down':
        return <ArrowDownIcon className="h-3 w-3" />;
      default:
        return <MinusIcon className="h-3 w-3" />;
    }
  };

  const getTrendColor = () => {
    // For most KPIs, up is good (green), but for expenses, up is bad (red)
    const isExpenseMetric = kpi.label.toLowerCase().includes('spend');
    
    if (kpi.trend === 'up') {
      return isExpenseMetric ? 'text-expense' : 'text-income';
    }
    if (kpi.trend === 'down') {
      return isExpenseMetric ? 'text-income' : 'text-expense';
    }
    return 'text-muted-foreground';
  };

  return (
    <Card className="relative overflow-hidden border-border/50 bg-card/80 backdrop-blur-sm shadow-elegant-md hover:shadow-elegant-lg transition-all duration-300">
      {/* Background gradient based on trend */}
      <div className={`absolute inset-0 opacity-5 ${
        kpi.trend === 'up' ? 'bg-gradient-success' : 
        kpi.trend === 'down' ? 'bg-gradient-danger' : 
        'bg-gradient-subtle'
      }`} />
      
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 relative z-10">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {kpi.label}
        </CardTitle>
        <div className={`flex items-center space-x-1 ${getTrendColor()}`}>
          {getTrendIcon()}
        </div>
      </CardHeader>
      
      <CardContent className="relative z-10">
        <div className="text-2xl font-bold text-foreground">
          {formatValue(kpi.value, kpi.currency)}
        </div>
        
        {kpi.diff !== undefined && (
          <div className="flex items-center space-x-2 mt-2">
            <p className={`text-xs flex items-center ${getTrendColor()}`}>
              {kpi.diff >= 0 ? '+' : '-'}
              {formatDiff(kpi.diff, kpi.currency)}
            </p>
            
            {kpi.diffPercent !== undefined && (
              <p className={`text-xs ${getTrendColor()}`}>
                ({kpi.diffPercent >= 0 ? '+' : ''}{kpi.diffPercent.toFixed(1)}%)
              </p>
            )}
          </div>
        )}
        
        <p className="text-xs text-muted-foreground mt-1">
          vs. last month
        </p>
      </CardContent>
    </Card>
  );
}