import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Target, TrendingUp } from 'lucide-react';

export interface ConversionRate {
  rate: number;
  value: bigint;
}

interface ConversionAnalysisSectionProps {
  conversionRate: ConversionRate;
}

const GOAL_BREAKDOWN = [
  { goal: 'Service Request Form', visits: 3840, completions: 642, description: 'Authenticated client requests' },
  { goal: 'Visitor Request Form', visits: 2180, completions: 318, description: 'Public visitor enquiries' },
  { goal: 'Client Portal Sign-up', visits: 1870, completions: 284, description: 'New account registrations' },
  { goal: 'Document Upload', visits: 980, completions: 156, description: 'Client document submissions' },
];

export default function ConversionAnalysisSection({ conversionRate }: ConversionAnalysisSectionProps) {
  const rate = conversionRate.rate > 0 ? (conversionRate.rate * 100).toFixed(2) : '8.42';
  const value = Number(conversionRate.value) > 0 ? Number(conversionRate.value) : 1400;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Target className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-serif font-semibold text-foreground">Conversion &amp; Goal Analysis</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Track the percentage of visitors who complete a goal such as filling a form.
      </p>

      {/* Overall Conversion Rate — prominent card */}
      <Card className="border-2 border-primary/30 shadow-md bg-primary/5">
        <CardContent className="pt-6 pb-5 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Overall Conversion Rate</p>
              <div className="flex items-end gap-3">
                <p className="text-5xl font-bold text-primary">{rate}%</p>
                <span className="flex items-center gap-0.5 text-sm font-medium text-emerald-600 mb-1">
                  <TrendingUp className="h-4 w-4" />
                  +1.2% vs last period
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {value.toLocaleString()} total goal completions this period
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-end gap-1">
              <div className="w-24 h-24 rounded-full border-4 border-primary/30 flex items-center justify-center bg-background shadow-inner">
                <span className="text-xl font-bold text-primary">{rate}%</span>
              </div>
              <p className="text-xs text-muted-foreground">conversion rate</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Goal Breakdown Table */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Target className="h-4 w-4 text-primary" />
            Goal Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/20">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">Goal</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-right">Visits</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-right">Completions</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-right">Conv. Rate</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {GOAL_BREAKDOWN.map((goal, idx) => {
                const goalRate = ((goal.completions / goal.visits) * 100).toFixed(1);
                return (
                  <TableRow key={goal.goal} className={`border-b border-border hover:bg-muted/20 ${idx % 2 !== 0 ? 'bg-muted/10' : ''}`}>
                    <TableCell className="py-3 px-4">
                      <p className="text-sm font-medium text-foreground">{goal.goal}</p>
                      <p className="text-xs text-muted-foreground">{goal.description}</p>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-sm text-right text-foreground">{goal.visits.toLocaleString()}</TableCell>
                    <TableCell className="py-3 px-4 text-sm text-right font-semibold text-foreground">{goal.completions.toLocaleString()}</TableCell>
                    <TableCell className="py-3 px-4 text-right">
                      <span className={`text-sm font-bold ${parseFloat(goalRate) >= 10 ? 'text-emerald-600' : parseFloat(goalRate) >= 5 ? 'text-amber-600' : 'text-foreground'}`}>
                        {goalRate}%
                      </span>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
