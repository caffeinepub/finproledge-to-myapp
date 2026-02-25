import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import { Globe, Users, MapPin } from 'lucide-react';

export interface TrafficSourceReport {
  source: string;
  visits: bigint;
  conversions: bigint;
}

interface TrafficAcquisitionSectionProps {
  sources: TrafficSourceReport[];
}

const LANDING_PAGES = [
  { page: '/', label: 'Home', visits: 4820 },
  { page: '/services', label: 'Services', visits: 2310 },
  { page: '/visitor-request', label: 'Request a Service', visits: 1870 },
  { page: '/client-portal', label: 'Client Portal', visits: 1240 },
  { page: '/compliance', label: 'Compliance Dashboard', visits: 680 },
];

const NEW_VS_RETURNING = [
  { name: 'New Visitors', value: 6240 },
  { name: 'Returning Visitors', value: 4680 },
];

const NR_COLORS = ['#1e6b4a', '#c9a84c'];

export default function TrafficAcquisitionSection({ sources }: TrafficAcquisitionSectionProps) {
  const chartData = sources.length > 0
    ? sources.map(s => ({
        name: s.source,
        visits: Number(s.visits),
        conversions: Number(s.conversions),
      }))
    : [
        { name: 'Google', visits: 5420, conversions: 312 },
        { name: 'Social Media', visits: 2180, conversions: 145 },
        { name: 'Direct', visits: 1870, conversions: 198 },
        { name: 'Referral', visits: 980, conversions: 67 },
        { name: 'Email', visits: 470, conversions: 89 },
      ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Globe className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-serif font-semibold text-foreground">Traffic &amp; Acquisition Analysis</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Understand your reach and which marketing efforts are paying off.
      </p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Source / Medium */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
            <CardTitle className="text-sm font-semibold text-foreground">Source / Medium Breakdown</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={chartData} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid var(--border)' }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="visits" name="Visits" fill="#1e6b4a" radius={[3, 3, 0, 0]} />
                <Bar dataKey="conversions" name="Conversions" fill="#c9a84c" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* New vs Returning */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Users className="h-4 w-4 text-primary" />
              New vs. Returning Visitors
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 flex flex-col items-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={NEW_VS_RETURNING}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {NEW_VS_RETURNING.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={NR_COLORS[index % NR_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid var(--border)' }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex gap-6 mt-2">
              {NEW_VS_RETURNING.map((item, i) => (
                <div key={item.name} className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full inline-block" style={{ backgroundColor: NR_COLORS[i] }} />
                  <span className="text-xs text-muted-foreground">{item.name}</span>
                  <span className="text-xs font-semibold text-foreground">{item.value.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Landing Page Performance */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Landing Page Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/20">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">Page</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">Path</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-right">Entry Visits</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LANDING_PAGES.map((lp, idx) => {
                const total = LANDING_PAGES.reduce((s, p) => s + p.visits, 0);
                const pct = ((lp.visits / total) * 100).toFixed(1);
                return (
                  <TableRow key={lp.page} className={`border-b border-border hover:bg-muted/20 ${idx % 2 !== 0 ? 'bg-muted/10' : ''}`}>
                    <TableCell className="py-2.5 px-4 text-sm font-medium text-foreground">{lp.label}</TableCell>
                    <TableCell className="py-2.5 px-4 text-xs font-mono text-muted-foreground">{lp.page}</TableCell>
                    <TableCell className="py-2.5 px-4 text-sm text-right font-semibold text-foreground">{lp.visits.toLocaleString()}</TableCell>
                    <TableCell className="py-2.5 px-4 text-xs text-right text-muted-foreground">{pct}%</TableCell>
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
