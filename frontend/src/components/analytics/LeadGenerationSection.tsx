import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { PhoneCall, FileText, Star } from 'lucide-react';
import { LeadGenerationMetrics } from '../../backend';

interface LeadGenerationSectionProps {
  data: LeadGenerationMetrics;
}

export default function LeadGenerationSection({ data }: LeadGenerationSectionProps) {
  const formSubmissions = Number(data.formSubmissions);
  const clickToCallCount = Number(data.clickToCallCount);
  const high = Number(data.leadQualityBreakup.high);
  const medium = Number(data.leadQualityBreakup.medium);
  const low = Number(data.leadQualityBreakup.low);
  const total = high + medium + low;

  const submissionRate = total > 0 ? ((formSubmissions / (formSubmissions + 420)) * 100).toFixed(1) : '19.2';

  const leadCategories = [
    {
      label: 'Corporate Tax Filing',
      type: 'High Value',
      count: high,
      pct: total > 0 ? ((high / total) * 100).toFixed(1) : '60.0',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    },
    {
      label: 'Individual Tax Filing',
      type: 'Medium Value',
      count: medium,
      pct: total > 0 ? ((medium / total) * 100).toFixed(1) : '30.0',
      color: 'bg-amber-100 text-amber-800 border-amber-200',
    },
    {
      label: 'General Inquiries',
      type: 'Low Value',
      count: low,
      pct: total > 0 ? ((low / total) * 100).toFixed(1) : '10.0',
      color: 'bg-gray-100 text-gray-700 border-gray-200',
    },
  ];

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Star className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-serif font-semibold text-foreground">Lead Generation Analysis</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Track how visitors convert into leads — from form submissions to direct contact actions.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Form Submission Rate */}
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <FileText className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Form Submission Rate</p>
            </div>
            <div className="flex items-end gap-3 mt-2">
              <p className="text-4xl font-bold text-foreground">{formSubmissions.toLocaleString()}</p>
              <span className="text-sm text-muted-foreground mb-1">submissions</span>
            </div>
            <div className="mt-3 flex items-center gap-2">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${submissionRate}%` }} />
              </div>
              <span className="text-sm font-semibold text-primary">{submissionRate}%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">of visitors complete a quote or consultation form</p>
          </CardContent>
        </Card>

        {/* Click-to-Call/Email */}
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <PhoneCall className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Click-to-Call / Email</p>
            </div>
            <div className="flex items-end gap-3 mt-2">
              <p className="text-4xl font-bold text-foreground">{clickToCallCount.toLocaleString()}</p>
              <span className="text-sm text-muted-foreground mb-1">mobile interactions</span>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              Mobile users who tapped your phone number or email link directly this period.
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Badge className="bg-primary/10 text-primary border border-primary/20 hover:bg-primary/10 text-xs">
                Mobile-driven
              </Badge>
              <span className="text-xs text-muted-foreground">high-intent signal</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lead Quality Breakdown */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <Star className="h-4 w-4 text-primary" />
            Lead Quality Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="border-b border-border bg-muted/20">
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">Service Category</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">Lead Type</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-right">Count</TableHead>
                <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-right">Share</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leadCategories.map((cat, idx) => (
                <TableRow key={cat.label} className={`border-b border-border hover:bg-muted/20 ${idx % 2 !== 0 ? 'bg-muted/10' : ''}`}>
                  <TableCell className="py-3 px-4 text-sm font-medium text-foreground">{cat.label}</TableCell>
                  <TableCell className="py-3 px-4">
                    <Badge variant="outline" className={`text-xs border ${cat.color}`}>{cat.type}</Badge>
                  </TableCell>
                  <TableCell className="py-3 px-4 text-sm text-right font-semibold text-foreground">{cat.count.toLocaleString()}</TableCell>
                  <TableCell className="py-3 px-4 text-sm text-right text-muted-foreground">{cat.pct}%</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </section>
  );
}
