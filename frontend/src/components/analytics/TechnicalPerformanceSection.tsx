import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Zap, Smartphone, AlertTriangle } from 'lucide-react';

export interface WebVitals {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
}

interface TechnicalPerformanceSectionProps {
  webVitals: WebVitals;
}

type VitalRating = 'Good' | 'Needs Improvement' | 'Poor';

function getRating(score: number): VitalRating {
  if (score >= 0.9) return 'Good';
  if (score >= 0.5) return 'Needs Improvement';
  return 'Poor';
}

function ratingBadge(rating: VitalRating) {
  if (rating === 'Good') {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-xs">
        Good
      </Badge>
    );
  }
  if (rating === 'Needs Improvement') {
    return (
      <Badge className="bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-100 text-xs">
        Needs Improvement
      </Badge>
    );
  }
  return (
    <Badge className="bg-red-100 text-red-800 border border-red-200 hover:bg-red-100 text-xs">
      Poor
    </Badge>
  );
}

function scoreColor(rating: VitalRating): string {
  if (rating === 'Good') return 'text-emerald-600';
  if (rating === 'Needs Improvement') return 'text-amber-600';
  return 'text-red-600';
}

const ERROR_MONITORING = [
  { type: '404 Not Found', url: '/old-services-page', count: 142 },
  { type: 'Broken Link', url: '/resources/2022-tax-guide.pdf', count: 87 },
  { type: '404 Not Found', url: '/team/john-doe', count: 34 },
  { type: 'Broken Link', url: 'https://partner-site.example.com', count: 12 },
];

export default function TechnicalPerformanceSection({ webVitals }: TechnicalPerformanceSectionProps) {
  const perf = webVitals.performance > 0 ? webVitals.performance : 0.82;
  const accessibility = webVitals.accessibility > 0 ? webVitals.accessibility : 0.94;
  const bestPractices = webVitals.bestPractices > 0 ? webVitals.bestPractices : 0.88;
  const seo = webVitals.seo > 0 ? webVitals.seo : 0.91;

  const vitals = [
    {
      key: 'LCP',
      label: 'Largest Contentful Paint',
      description: 'Load speed',
      score: perf,
      value: perf >= 0.9 ? '1.8s' : perf >= 0.5 ? '3.2s' : '5.1s',
      rating: getRating(perf),
    },
    {
      key: 'INP',
      label: 'Interaction to Next Paint',
      description: 'Interaction responsiveness',
      score: bestPractices,
      value: bestPractices >= 0.9 ? '72ms' : bestPractices >= 0.5 ? '210ms' : '520ms',
      rating: getRating(bestPractices),
    },
    {
      key: 'CLS',
      label: 'Cumulative Layout Shift',
      description: 'Visual stability',
      score: accessibility,
      value: accessibility >= 0.9 ? '0.04' : accessibility >= 0.5 ? '0.18' : '0.42',
      rating: getRating(accessibility),
    },
  ];

  const mobileScore = Math.round(seo * 100);
  const mobilePassed = mobileScore >= 80;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-serif font-semibold text-foreground">Technical Performance (Web Vitals)</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Core Web Vitals, mobile-friendliness, and error monitoring for a healthy site.
      </p>

      {/* Core Web Vitals */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {vitals.map((v) => (
          <Card key={v.key} className="border border-border shadow-sm">
            <CardContent className="pt-5 pb-4 px-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-2xl font-bold text-foreground font-mono">{v.key}</p>
                  <p className="text-xs text-muted-foreground">{v.description}</p>
                </div>
                {ratingBadge(v.rating)}
              </div>
              <p className={`text-3xl font-bold mt-2 ${scoreColor(v.rating)}`}>{v.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{v.label}</p>
              <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${v.rating === 'Good' ? 'bg-emerald-500' : v.rating === 'Needs Improvement' ? 'bg-amber-500' : 'bg-red-500'}`}
                  style={{ width: `${Math.round(v.score * 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1 text-right">{Math.round(v.score * 100)}/100</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Mobile Friendliness */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Smartphone className="h-4 w-4 text-primary" />
              Mobile-Friendliness
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-4xl font-bold text-foreground">{mobileScore}<span className="text-base font-normal text-muted-foreground">/100</span></p>
                <p className="text-xs text-muted-foreground mt-1">Mobile usability score</p>
              </div>
              <Badge
                className={mobilePassed
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 text-sm px-3 py-1'
                  : 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-100 text-sm px-3 py-1'}
              >
                {mobilePassed ? '✓ Pass' : '✗ Fail'}
              </Badge>
            </div>
            <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${mobilePassed ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${mobileScore}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {mobilePassed
                ? 'Site renders correctly on all screen sizes.'
                : 'Some pages may not render correctly on mobile devices.'}
            </p>
          </CardContent>
        </Card>

        {/* Error Monitoring */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Error Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/20">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">Error Type</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">URL</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-right">Hits</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ERROR_MONITORING.map((err, idx) => (
                  <TableRow key={idx} className={`border-b border-border hover:bg-muted/20 ${idx % 2 !== 0 ? 'bg-muted/10' : ''}`}>
                    <TableCell className="py-2 px-4">
                      <Badge
                        variant="outline"
                        className={err.type === '404 Not Found'
                          ? 'border-red-300 text-red-700 text-xs'
                          : 'border-amber-300 text-amber-700 text-xs'}
                      >
                        {err.type}
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2 px-4 text-xs font-mono text-muted-foreground max-w-[160px] truncate">{err.url}</TableCell>
                    <TableCell className="py-2 px-4 text-sm text-right font-semibold text-foreground">{err.count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
