import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { ChartContainer, ChartTooltipContent } from '@/components/ui/chart';
import type { CategorySummary } from '@/types/common';

interface CategoryPieChartProps {
  data: CategorySummary[];
  height?: number;
  currency?: string;
}

const DEFAULT_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', 
  '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA'
];

export function CategoryPieChart({ data, height = 300, currency = 'USD' }: CategoryPieChartProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const chartData = data.slice(0, 8).map((item, index) => ({
    ...item,
    fill: item.color || DEFAULT_COLORS[index % DEFAULT_COLORS.length],
  }));

  const renderLabel = (entry: any) => {
    return `${entry.percentage.toFixed(1)}%`;
  };

  return (
    <div className="space-y-4">
      <ChartContainer 
        config={chartData.reduce((acc, item) => ({
          ...acc,
          [item.categoryId]: {
            label: item.categoryName,
            color: item.fill,
          }
        }), {})}
      >
        <ResponsiveContainer width="100%" height={height}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="amount"
              strokeWidth={2}
              stroke="hsl(var(--background))"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              content={
                <ChartTooltipContent
                  formatter={(value, name) => [
                    formatCurrency(value as number),
                    name as string
                  ]}
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </ChartContainer>

      {/* Legend */}
      <div className="grid grid-cols-2 gap-2 text-sm">
        {chartData.map((item) => (
          <div key={item.categoryId} className="flex items-center gap-2">
            <div 
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: item.fill }}
            />
            <span className="text-muted-foreground truncate">
              {item.categoryName}
            </span>
            <span className="ml-auto font-medium">
              {formatCurrency(item.amount)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}