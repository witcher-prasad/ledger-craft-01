import { Calendar, Plus, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { KPICard } from '@/components/charts/KPICard';
import { TrendChart } from '@/components/charts/TrendChart';
import { CategoryPieChart } from '@/components/charts/CategoryPieChart';
import { useDashboardOverview } from '@/features/dashboard/hooks';
import { useUIStore } from '@/store/useUIStore';
import { format } from 'date-fns';

export default function Dashboard() {
  const { data: overview, isLoading, error } = useDashboardOverview();
  const { openTransactionDrawer } = useUIStore();

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h3 className="text-lg font-medium text-foreground">Something went wrong</h3>
          <p className="text-sm text-muted-foreground mt-1">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview for {format(new Date(), 'MMMM yyyy')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm">
            <Calendar className="mr-2 h-4 w-4" />
            This Month
          </Button>
          <Button 
            size="sm" 
            className="bg-gradient-primary hover:opacity-90"
            onClick={() => openTransactionDrawer()}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Transaction
          </Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {isLoading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-16" />
            </Card>
          ))
        ) : (
          overview?.kpis.map((kpi, index) => (
            <KPICard key={index} kpi={kpi} />
          ))
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Spending Trend */}
        <Card className="border-border/50 shadow-elegant-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Spending Trend
            </CardTitle>
            <CardDescription>
              Daily spending over the last 30 days
            </CardDescription>
          </CardHeader>
          <CardContent className="pb-2">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : (
              <TrendChart 
                data={overview?.trend || []} 
                height={300} 
                currency="USD" 
              />
            )}
          </CardContent>
        </Card>

        {/* Category Breakdown */}
        <Card className="border-border/50 shadow-elegant-md">
          <CardHeader>
            <CardTitle>Category Breakdown</CardTitle>
            <CardDescription>
              Spending by category this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                <Skeleton className="h-[200px] w-full rounded-full" />
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Skeleton className="w-3 h-3 rounded-full" />
                      <Skeleton className="h-4 flex-1" />
                    </div>
                  ))}
                </div>
              </div>
            ) : overview?.categories.length ? (
              <CategoryPieChart 
                data={overview.categories} 
                height={200} 
                currency="USD" 
              />
            ) : (
              <div className="flex items-center justify-center h-[200px] text-muted-foreground">
                No spending data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Bills */}
      <Card className="border-border/50 shadow-elegant-md">
        <CardHeader>
          <CardTitle>Upcoming Bills</CardTitle>
          <CardDescription>
            Scheduled recurring transactions
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-24" />
                  </div>
                  <Skeleton className="h-4 w-16" />
                </div>
              ))}
            </div>
          ) : overview?.upcomingBills.length ? (
            <div className="space-y-3">
              {overview.upcomingBills.map((bill) => (
                <div 
                  key={bill.id} 
                  className="flex items-center justify-between p-3 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors"
                >
                  <div>
                    <h4 className="font-medium text-foreground">{bill.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Due {format(new Date(bill.nextRun), 'MMM dd')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-foreground">
                      ${bill.template.amount?.toFixed(2)}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {bill.frequency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No upcoming bills scheduled
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}