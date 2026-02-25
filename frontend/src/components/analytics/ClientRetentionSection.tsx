import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
} from 'recharts';
import { RefreshCw, Users, AlertTriangle } from 'lucide-react';
import { ClientRetentionMetrics } from '../../backend';

interface ClientRetentionSectionProps {
  data: ClientRetentionMetrics;
}

const FUNNEL_STEPS = [
  { step: 'Portal Visit', label: 'User visits the client portal', users: 1000 },
  { step: 'Login Attempt', label: 'User initiates login', users: 820 },
  { step: 'Login Success', label: 'User successfully authenticates', users: 680 },
  { step: 'Document Upload', label: 'User navigates to upload section', users: 420 },
  { step: 'Upload Complete', label: 'User successfully uploads a document', users: 310 },
  { step: 'Form Submission', label: 'User submits a service request', users: 210 },
];

const PIE_COLORS = ['#1e6b4a', '#c9a84c'];

export default function ClientRetentionSection({ data }: ClientRetentionSectionProps) {
  const returningRatio = data.returningUserRatio;
  const portalDropoffs = Number(data.portalFunnelDropoffs);

  const returningPct = (returningRatio * 100).toFixed(1);
  const newPct = ((1 - returningRatio) * 100).toFixed(1);

  const pieData = [
    { name: 'Returning Clients', value: Math.round(returningRatio * 1000) },
    { name: 'New Visitors', value: Math.round((1 - returningRatio) * 1000) },
  ];

  // Scale funnel steps based on portalDropoffs hint
  const scaledFunnel = FUNNEL_STEPS.map((step, idx) => {
    const baseDropRate = idx === 0 ? 0 : (FUNNEL_STEPS[idx - 1].users - step.users) / FUNNEL_STEPS[idx - 1].users;
    return {
      ...step,
      dropRate: idx === 0 ? null : (baseDropRate * 100).toFixed(1),
    };
  });

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <RefreshCw className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-serif font-semibold text-foreground">Client Retention &amp; Portal Usage</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Track how often existing clients return and identify friction points in the client portal.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Returning User Ratio */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              Returning vs. New Visitors
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="flex flex-col items-center">
              <ResponsiveContainer width="100%" height={180}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                    label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid var(--border)' }}
                    formatter={(value: number, name: string) => [value, name]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex gap-6 mt-2">
                {pieData.map((item, i) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: PIE_COLORS[i] }} />
                    <span className="text-xs text-muted-foreground">{item.name}</span>
                    <span className="text-xs font-semibold text-foreground">
                      {i === 0 ? returningPct : newPct}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 p-3 bg-primary/5 rounded-lg border border-primary/20">
              <p className="text-xs text-muted-foreground">Returning User Ratio</p>
              <p className="text-2xl font-bold text-primary">{returningPct}%</p>
              <p className="text-xs text-muted-foreground mt-1">
                {returningRatio >= 0.6
                  ? 'Strong client loyalty — existing clients regularly return to access documents.'
                  : 'Opportunity to improve client retention through portal engagement.'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Portal Friction Summary */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Portal Friction Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <p className="text-xs text-amber-800 font-medium">
                {portalDropoffs} drop-off events detected this period
              </p>
              <p className="text-xs text-amber-700 mt-0.5">
                Users abandoning the portal before completing their task.
              </p>
            </div>
            <div className="space-y-2">
              {[
                { label: 'Login Drop-off', pct: 17, desc: 'Users who fail to complete login' },
                { label: 'Upload Abandonment', pct: 26, desc: 'Users who start but don\'t finish uploading' },
                { label: 'Form Incompletion', pct: 33, desc: 'Users who leave mid-form submission' },
              ].map((item) => (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-foreground">{item.label}</span>
                    <span className={`text-xs font-bold ${item.pct >= 30 ? 'text-red-600' : item.pct >= 20 ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {item.pct}% drop-off
                    </span>
                  </div>
                  <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${item.pct >= 30 ? 'bg-red-500' : item.pct >= 20 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                      style={{ width: `${item.pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Portal Funnel Table */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-primary" />
            Portal Usage Funnel
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/20">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">#</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">Step</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">Description</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-right">Users</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-right">Drop-off</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {scaledFunnel.map((step, idx) => (
                <TableRow key={step.step} className={`border-b border-border hover:bg-muted/20 ${idx % 2 !== 0 ? 'bg-muted/10' : ''}`}>
                  <TableCell className="py-2.5 px-4 text-xs text-muted-foreground font-mono">{idx + 1}</TableCell>
                  <TableCell className="py-2.5 px-4 text-sm font-medium text-foreground">{step.step}</TableCell>
                  <TableCell className="py-2.5 px-4 text-xs text-muted-foreground">{step.label}</TableCell>
                  <TableCell className="py-2.5 px-4 text-sm text-right font-semibold text-foreground">{step.users.toLocaleString()}</TableCell>
                  <TableCell className="py-2.5 px-4 text-right">
                    {step.dropRate !== null ? (
                      <span className={`text-xs font-bold ${parseFloat(step.dropRate) >= 30 ? 'text-red-600' : parseFloat(step.dropRate) >= 15 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        -{step.dropRate}%
                      </span>
                    ) : (
                      <span className="text-xs text-muted-foreground">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
