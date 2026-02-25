import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { MapPin, TrendingUp, Bot } from 'lucide-react';
import { SearchIntentMetrics } from '../../backend';

interface SearchIntentSectionProps {
  data: SearchIntentMetrics;
}

const LOCAL_SEO_KEYWORDS = [
  { keyword: 'Accountant near me', position: 4, trend: +2 },
  { keyword: 'Tax services [City]', position: 6, trend: +1 },
  { keyword: 'Corporate tax advisor local', position: 8, trend: -1 },
  { keyword: 'Small business accountant', position: 5, trend: +3 },
  { keyword: 'Income tax filing near me', position: 11, trend: 0 },
];

const SEASONAL_DATA = [
  { month: 'Jan', traffic: 3200, deadline: false },
  { month: 'Feb', traffic: 3800, deadline: false },
  { month: 'Mar', traffic: 5400, deadline: false },
  { month: 'Apr', traffic: 9200, deadline: true },
  { month: 'May', traffic: 4100, deadline: false },
  { month: 'Jun', traffic: 3600, deadline: false },
  { month: 'Jul', traffic: 3400, deadline: false },
  { month: 'Aug', traffic: 3900, deadline: false },
  { month: 'Sep', traffic: 5100, deadline: false },
  { month: 'Oct', traffic: 7800, deadline: true },
  { month: 'Nov', traffic: 4200, deadline: false },
  { month: 'Dec', traffic: 3700, deadline: false },
];

export default function SearchIntentSection({ data }: SearchIntentSectionProps) {
  const localSeoRankings = Number(data.localSeoRankings);
  const aiVisibilityScore = Number(data.aiVisibilityScore);
  const seasonalKeywords = data.seasonalKeywordTrends;

  const aiVisible = aiVisibilityScore >= 60;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <MapPin className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-serif font-semibold text-foreground">Search Intent &amp; SEO</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Track local search rankings, seasonal keyword spikes, and AI search engine visibility.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Local SEO Summary Card */}
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Local SEO Keywords Tracked</p>
            </div>
            <p className="text-4xl font-bold text-foreground mt-2">{localSeoRankings}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Keywords actively tracked for local search positions (e.g., "Accountant near me").
            </p>
            {seasonalKeywords.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {seasonalKeywords.map((kw) => (
                  <span key={kw} className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full border border-primary/20">
                    {kw}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* AI Search Visibility */}
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <Bot className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">AI Search Visibility</p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-4xl font-bold text-foreground">{aiVisibilityScore}<span className="text-base font-normal text-muted-foreground">/100</span></p>
              <Badge
                className={aiVisible
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-100'}
              >
                {aiVisible ? 'Visible' : 'Low Visibility'}
              </Badge>
            </div>
            <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${aiVisible ? 'bg-emerald-500' : 'bg-amber-500'}`}
                style={{ width: `${aiVisibilityScore}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Likelihood that AI search engines (Google SGE, Perplexity) cite your site as a reliable financial source.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Seasonal Keyword Trends Chart */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            Seasonal Keyword Traffic Trends
            <span className="ml-2 text-xs font-normal text-muted-foreground">— highlighted bars = tax deadline months</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={SEASONAL_DATA} margin={{ top: 4, right: 8, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 6, border: '1px solid var(--border)' }}
                formatter={(value: number) => [value.toLocaleString(), 'Traffic']}
              />
              <Bar dataKey="traffic" name="Traffic" radius={[3, 3, 0, 0]}>
                {SEASONAL_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.deadline ? '#c9a84c' : '#1e6b4a'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2 justify-center">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#1e6b4a' }} />
              <span className="text-xs text-muted-foreground">Regular Month</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm inline-block" style={{ backgroundColor: '#c9a84c' }} />
              <span className="text-xs text-muted-foreground">Tax Deadline Month (Apr, Oct)</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Local SEO Rankings Table */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            Local SEO Rankings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/20">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">Keyword</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-center">Position</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-center">Trend</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {LOCAL_SEO_KEYWORDS.map((kw, idx) => (
                <TableRow key={kw.keyword} className={`border-b border-border hover:bg-muted/20 ${idx % 2 !== 0 ? 'bg-muted/10' : ''}`}>
                  <TableCell className="py-2.5 px-4 text-sm text-foreground">{kw.keyword}</TableCell>
                  <TableCell className="py-2.5 px-4 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${kw.position <= 5 ? 'bg-emerald-100 text-emerald-800' : kw.position <= 10 ? 'bg-amber-100 text-amber-800' : 'bg-muted text-muted-foreground'}`}>
                      {kw.position}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5 px-4 text-center">
                    {kw.trend > 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">▲ +{kw.trend}</span>
                    ) : kw.trend < 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-red-600">▼ {kw.trend}</span>
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
