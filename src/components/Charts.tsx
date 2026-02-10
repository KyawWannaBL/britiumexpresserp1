import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

/**
 * Britium Express Analytics Components
 * High-performance charting using Recharts with OKLCH theme integration
 */

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  valuePrefix?: string;
}

const CustomTooltip = ({ active, payload, label, valuePrefix = '' }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border p-3 rounded-lg shadow-lg backdrop-blur-md">
        <p className="text-xs font-semibold text-muted-foreground mb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: entry.color }}
            />
            <p className="text-sm font-mono font-medium">
              {entry.name}: {valuePrefix}{entry.value.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

export function DeliveryChart({ data }: { data: any[] }) {
  return (
    <Card className="w-full h-full min-h-[400px] border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-lg font-semibold">Delivery Volume</CardTitle>
        <CardDescription>Daily shipment throughput and completion rate</CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorDelivered" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="total"
              stroke="var(--primary)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorTotal)"
              name="Total Shipments"
            />
            <Area
              type="monotone"
              dataKey="delivered"
              stroke="var(--accent)"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorDelivered)"
              name="Delivered"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RevenueChart({ data }: { data: any[] }) {
  return (
    <Card className="w-full h-full min-h-[400px] border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-lg font-semibold">Financial Overview</CardTitle>
        <CardDescription>Revenue vs. Operational Expenses (USD)</CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }}
              tickFormatter={(value) => `$${value / 1000}k`}
            />
            <Tooltip content={<CustomTooltip valuePrefix="$" />} />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle" 
              wrapperStyle={{ paddingBottom: '20px', fontSize: '12px' }}
            />
            <Line
              type="stepAfter"
              dataKey="revenue"
              stroke="var(--primary)"
              strokeWidth={3}
              dot={{ r: 4, fill: 'var(--primary)', strokeWidth: 2, stroke: 'var(--card)' }}
              activeDot={{ r: 6 }}
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="expense"
              stroke="var(--destructive)"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              name="Expenses"
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function PerformanceChart({ data }: { data: any[] }) {
  const COLORS = [
    'oklch(0.60 0.16 150)', // Success/Delivered
    'oklch(0.48 0.16 255)', // Primary/Pending
    'oklch(0.72 0.18 45)',  // Accent/In Transit
    'oklch(0.60 0.20 25)',  // Destructive/Failed
  ];

  return (
    <Card className="w-full h-full min-h-[400px] border-none shadow-none bg-transparent">
      <CardHeader className="px-0">
        <CardTitle className="text-lg font-semibold">Fleet Performance</CardTitle>
        <CardDescription>Status distribution across active shipments</CardDescription>
      </CardHeader>
      <CardContent className="p-0 h-[300px] flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              nameKey="name"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="transparent" />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ backgroundColor: 'var(--card)', border: '1px solid var(--border)', borderRadius: '8px' }}
              itemStyle={{ color: 'var(--foreground)', fontFamily: 'var(--font-mono)' }}
            />
            <Legend 
              verticalAlign="bottom" 
              align="center" 
              layout="horizontal" 
              iconType="circle"
              wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}