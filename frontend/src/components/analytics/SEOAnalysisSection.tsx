import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TrendingUp, TrendingDown, Search, Link2, BarChart2 } from 'lucide-react';

export interface SEOScore {
  score: bigint;
  keywords: bigint;
  backlinks: bigint;
}

interface SEOAnalysisSectionProps {
  seoScore: SEOScore;
}

const KEYWORDS = [
  { keyword: 'accounting firm services', position: 3, delta: +2 },
  { keyword: 'income tax filing professionals', position: 7, delta: -1 },
  { keyword: 'corporate tax advisory', position: 5, delta: +4 },
  { keyword: 'payroll management services', position: 12, delta: 0 },
  { keyword: 'audit and compliance firm', position: 9, delta: +1 },
];

export default function SEOAnalysisSection({ seoScore }: SEOAnalysisSectionProps) {
  const score = Number(seoScore.score) > 0 ? Number(seoScore.score) : 78;
  const keywords = Number(seoScore.keywords) > 0 ? Number(seoScore.keywords) : 142;
  const backlinks = Number(seoScore.backlinks) > 0 ? Number(seoScore.backlinks) : 384;

  const ctr = 4.7;
  const domainAuthority = Math.round(score * 0.9);
  const backlinkStatus = backlinks > 200 ? 'Healthy' : 'At Risk';

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Search className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-serif font-semibold text-foreground">Search Engine Optimisation (SEO)</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Ensure your site remains visible in a world of AI-driven search results.
      </p>

      {/* Top stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* SEO Score */}
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">SEO Score</p>
            </div>
            <p className="text-3xl font-bold text-foreground">{score}<span className="text-base font-normal text-muted-foreground">/100</span></p>
            <div className="mt-2 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${score}%` }} />
            </div>
          </CardContent>
        </Card>

        {/* CTR */}
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-emerald-600" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Click-Through Rate</p>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-3xl font-bold text-foreground">{ctr}%</p>
              <span className="flex items-center gap-0.5 text-xs font-medium text-emerald-600 mb-1">
                <TrendingUp className="h-3 w-3" />
                +0.4% vs last period
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">of impressions result in a click</p>
          </CardContent>
        </Card>

        {/* Backlink Health */}
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <Link2 className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Backlink Health</p>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <p className="text-3xl font-bold text-foreground">{backlinks.toLocaleString()}</p>
              <Badge
                variant={backlinkStatus === 'Healthy' ? 'default' : 'destructive'}
                className={backlinkStatus === 'Healthy'
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-100'}
              >
                {backlinkStatus}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Domain Authority: <span className="font-semibold text-foreground">{domainAuthority}</span></p>
          </CardContent>
        </Card>
      </div>

      {/* Keyword Rankings Table */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Search className="h-4 w-4 text-primary" />
            Keyword Rankings
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/20">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">Keyword</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-center">Position</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-center">Change</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {KEYWORDS.map((kw, idx) => (
                <TableRow key={kw.keyword} className={`border-b border-border hover:bg-muted/20 ${idx % 2 !== 0 ? 'bg-muted/10' : ''}`}>
                  <TableCell className="py-2.5 px-4 text-sm text-foreground">{kw.keyword}</TableCell>
                  <TableCell className="py-2.5 px-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary text-sm font-bold">
                      {kw.position}
                    </span>
                  </TableCell>
                  <TableCell className="py-2.5 px-4 text-center">
                    {kw.delta > 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-emerald-600">
                        <TrendingUp className="h-3 w-3" />+{kw.delta}
                      </span>
                    ) : kw.delta < 0 ? (
                      <span className="inline-flex items-center gap-0.5 text-xs font-semibold text-red-600">
                        <TrendingDown className="h-3 w-3" />{kw.delta}
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
