import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BookOpen, Clock, ThumbsUp } from 'lucide-react';
import { TrustMetrics } from '../../backend';

interface TrustMetricsSectionProps {
  data: TrustMetrics;
}

const BLOG_ARTICLES = [
  { title: 'Understanding Corporate Tax Deductions in 2025', reads: 1840, category: 'Corporate Tax' },
  { title: 'Year-End Payroll Checklist for Small Businesses', reads: 1420, category: 'Payroll' },
  { title: 'How to Prepare for a CRA Audit', reads: 1180, category: 'Audit' },
  { title: 'Top 10 Tax Credits for Individuals', reads: 960, category: 'Income Tax' },
  { title: 'Bank Reconciliation Best Practices', reads: 720, category: 'Bookkeeping' },
];

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

export default function TrustMetricsSection({ data }: TrustMetricsSectionProps) {
  const blogEngagement = Number(data.blogEngagement);
  const aboutPageAvgTime = Number(data.aboutPageAvgTime); // seconds
  const testimonialClicks = Number(data.testimonialClicks);

  const totalReads = BLOG_ARTICLES.reduce((s, a) => s + a.reads, 0);

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-serif font-semibold text-foreground">Trust &amp; Authority Metrics</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Financial services clients vet your expertise before reaching out — track the signals that build credibility.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Average Time on About/Team Pages */}
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Avg. Time on About &amp; Team Pages</p>
            </div>
            <p className="text-4xl font-bold text-foreground mt-2">{formatDuration(aboutPageAvgTime)}</p>
            <p className="text-xs text-muted-foreground mt-2">
              High engagement here signals potential clients are researching your credentials and certifications.
            </p>
            <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full"
                style={{ width: `${Math.min((aboutPageAvgTime / 300) * 100, 100)}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-1">Benchmark: 2–5 min for financial services</p>
          </CardContent>
        </Card>

        {/* Review/Testimonial Clicks */}
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <ThumbsUp className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Review &amp; Testimonial Clicks</p>
            </div>
            <p className="text-4xl font-bold text-foreground mt-2">{testimonialClicks.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground mt-2">
              Users interacting with social proof, case studies, or client testimonials this period.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-500 rounded-full"
                  style={{ width: `${Math.min((testimonialClicks / 100) * 100, 100)}%` }}
                />
              </div>
              <span className="text-xs font-semibold text-amber-600">{testimonialClicks} clicks</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Resources/Blog Engagement */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-primary" />
            Resources &amp; Blog Engagement
            <span className="ml-auto text-xs font-normal text-muted-foreground">{blogEngagement.toLocaleString()} total engagements</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/20">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">Article</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">Category</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-right">Reads</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {BLOG_ARTICLES.map((article, idx) => {
                const pct = ((article.reads / totalReads) * 100).toFixed(1);
                return (
                  <TableRow key={article.title} className={`border-b border-border hover:bg-muted/20 ${idx % 2 !== 0 ? 'bg-muted/10' : ''}`}>
                    <TableCell className="py-3 px-4">
                      <p className="text-sm font-medium text-foreground leading-snug">{article.title}</p>
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">{article.category}</span>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-sm text-right font-semibold text-foreground">{article.reads.toLocaleString()}</TableCell>
                    <TableCell className="py-3 px-4 text-sm text-right text-muted-foreground">{pct}%</TableCell>
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
