'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, TrendingUp, TrendingDown, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const weeklyData = [
  { day: 'Mon', cost: 142 },
  { day: 'Tue', cost: 156 },
  { day: 'Wed', cost: 138 },
  { day: 'Thu', cost: 169 },
  { day: 'Fri', cost: 151 },
  { day: 'Sat', cost: 98 },
  { day: 'Sun', cost: 102 },
];

const serviceBreakdown = [
  { service: 'EC2', cost: 543.20, percentage: 52 },
  { service: 'RDS', cost: 312.80, percentage: 30 },
  { service: 'S3', cost: 187.50, percentage: 18 },
];

const currentWeekTotal = weeklyData.reduce((sum, d) => sum + d.cost, 0);
const previousWeekTotal = 1124;
const changePercentage = ((currentWeekTotal - previousWeekTotal) / previousWeekTotal) * 100;

export default function ReportPage() {
  const maxCost = Math.max(...weeklyData.map((d) => d.cost));

  return (
    <div className="p-8">
      <div className="mb-8 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">
            Weekly Cost Report
          </h1>
          <p className="text-sm text-slate-600">
            Infrastructure spending analysis for the past 7 days
          </p>
        </div>
        <Button variant="outline" size="sm">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardDescription>Current Week Spend</CardDescription>
            <CardTitle className="text-3xl">${currentWeekTotal.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {changePercentage < 0 ? (
                <>
                  <TrendingDown className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-600">
                    {Math.abs(changePercentage).toFixed(1)}% lower
                  </span>
                </>
              ) : (
                <>
                  <TrendingUp className="h-4 w-4 text-amber-600" />
                  <span className="text-sm font-medium text-amber-600">
                    {changePercentage.toFixed(1)}% higher
                  </span>
                </>
              )}
              <span className="text-sm text-slate-500">vs previous week</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Previous Week Spend</CardDescription>
            <CardTitle className="text-3xl">${previousWeekTotal.toFixed(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-600">
              Dec 25 - Dec 31, 2024
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Daily Cost Trend</CardTitle>
          <CardDescription>Last 7 days infrastructure spend</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-between gap-2 pb-8 px-2">
            {weeklyData.map((day) => {
              const heightPercentage = (day.cost / maxCost) * 100;
              return (
                <div key={day.day} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className="w-full bg-slate-900 rounded-t hover:bg-slate-700 transition-colors relative group"
                    style={{ height: `${heightPercentage}%` }}
                  >
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="bg-slate-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
                        ${day.cost}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs text-slate-600 font-medium">{day.day}</span>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Service Breakdown</CardTitle>
          <CardDescription>Top services by cost this week</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {serviceBreakdown.map((item) => (
            <div key={item.service}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <Badge variant="outline" className="text-xs">
                    {item.service}
                  </Badge>
                  <span className="text-sm font-semibold text-slate-900">
                    ${item.cost.toFixed(2)}
                  </span>
                </div>
                <span className="text-sm text-slate-600">{item.percentage}%</span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2">
                <div
                  className="bg-slate-900 h-2 rounded-full transition-all"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Alert className="bg-slate-50 border-slate-200">
        <Info className="h-4 w-4 text-slate-600" />
        <AlertDescription className="text-slate-700 text-sm">
          <span className="font-medium">Data Source:</span> AWS Cost Explorer API. Costs are
          calculated based on usage-based pricing and may include a 24-48 hour delay. Tax and
          credits are excluded from totals.
        </AlertDescription>
      </Alert>
    </div>
  );
}
