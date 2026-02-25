import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, Smartphone, Gauge } from 'lucide-react';
import { TechnicalReliabilityMetrics } from '../../backend';

interface TechnicalReliabilitySectionProps {
  data: TechnicalReliabilityMetrics;
}

function getSpeedColor(ms: number): string {
  if (ms < 2000) return 'text-emerald-600';
  if (ms <= 4000) return 'text-amber-600';
  return 'text-red-600';
}

function getSpeedLabel(ms: number): string {
  if (ms < 2000) return 'Fast';
  if (ms <= 4000) return 'Moderate';
  return 'Slow';
}

function getSpeedBadgeClass(ms: number): string {
  if (ms < 2000) return 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100';
  if (ms <= 4000) return 'bg-amber-100 text-amber-800 border border-amber-200 hover:bg-amber-100';
  return 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-100';
}

function getMobileScoreColor(score: number): string {
  if (score >= 80) return 'text-emerald-600';
  if (score >= 50) return 'text-amber-600';
  return 'text-red-600';
}

export default function TechnicalReliabilitySection({ data }: TechnicalReliabilitySectionProps) {
  const sslStatus = data.sslStatus;
  const mobileScore = Number(data.mobileScore);
  const pageLoadMs = Number(data.pageLoadMs);

  const pageLoadSec = (pageLoadMs / 1000).toFixed(2);
  const securityScore = sslStatus ? Math.min(95, 70 + Math.round(mobileScore * 0.25)) : 30;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <ShieldCheck className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-serif font-semibold text-foreground">Technical Reliability</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Financial clients expect a secure, professional experience — monitor the technical health of your site.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Security & SSL Status */}
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Security &amp; SSL</p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <p className="text-4xl font-bold text-foreground">{securityScore}<span className="text-base font-normal text-muted-foreground">/100</span></p>
              <Badge
                className={sslStatus
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                  : 'bg-red-100 text-red-800 border border-red-200 hover:bg-red-100'}
              >
                {sslStatus ? '🔒 SSL Valid' : '⚠ SSL Invalid'}
              </Badge>
            </div>
            <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${sslStatus ? 'bg-emerald-500' : 'bg-red-500'}`}
                style={{ width: `${securityScore}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {sslStatus
                ? 'Your site is fully secured. Users can safely share financial data.'
                : 'SSL certificate issue detected. Resolve immediately to protect user data.'}
            </p>
          </CardContent>
        </Card>

        {/* Mobile Responsiveness */}
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Mobile Responsiveness</p>
            </div>
            <div className="flex items-end gap-2 mt-2">
              <p className={`text-4xl font-bold ${getMobileScoreColor(mobileScore)}`}>
                {mobileScore}<span className="text-base font-normal text-muted-foreground">/100</span>
              </p>
            </div>
            <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${mobileScore >= 80 ? 'bg-emerald-500' : mobileScore >= 50 ? 'bg-amber-500' : 'bg-red-500'}`}
                style={{ width: `${mobileScore}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {mobileScore >= 80
                ? 'Excellent mobile experience for on-the-go business owners.'
                : mobileScore >= 50
                ? 'Some mobile usability issues detected. Review layout on small screens.'
                : 'Poor mobile experience. Many small business owners browse on phones.'}
            </p>
          </CardContent>
        </Card>

        {/* Page Load Speed */}
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-5 pb-4 px-5">
            <div className="flex items-center gap-2 mb-1">
              <Gauge className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Page Load Speed</p>
            </div>
            <div className="flex items-center gap-3 mt-2">
              <p className={`text-4xl font-bold ${getSpeedColor(pageLoadMs)}`}>
                {pageLoadSec}<span className="text-base font-normal text-muted-foreground">s</span>
              </p>
              <Badge className={getSpeedBadgeClass(pageLoadMs)}>
                {getSpeedLabel(pageLoadMs)}
              </Badge>
            </div>
            <div className="mt-3 h-2 w-full bg-muted rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${getSpeedColor(pageLoadMs).replace('text-', 'bg-').replace('-600', '-500')}`}
                style={{ width: `${Math.max(10, 100 - (pageLoadMs / 60))}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {pageLoadMs < 2000
                ? 'Fast load time. Busy professionals won\'t bounce from your contact page.'
                : pageLoadMs <= 4000
                ? 'Moderate speed. Consider optimising images and scripts.'
                : 'Slow load time. High bounce rates likely on your contact page.'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Security Checklist */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
          <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Security &amp; Reliability Checklist
          </CardTitle>
        </CardHeader>
        <CardContent className="p-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: 'SSL Certificate', pass: sslStatus },
              { label: 'HTTPS Enforced', pass: sslStatus },
              { label: 'Mobile Responsive', pass: mobileScore >= 80 },
              { label: 'Page Load < 2s', pass: pageLoadMs < 2000 },
              { label: 'No Mixed Content', pass: sslStatus },
              { label: 'Contact Page Speed', pass: pageLoadMs < 3000 },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-2.5 p-2.5 rounded-lg bg-muted/30 border border-border">
                <span className={`text-base ${item.pass ? 'text-emerald-600' : 'text-red-500'}`}>
                  {item.pass ? '✓' : '✗'}
                </span>
                <span className="text-sm text-foreground">{item.label}</span>
                <Badge
                  variant="outline"
                  className={`ml-auto text-xs ${item.pass ? 'border-emerald-300 text-emerald-700' : 'border-red-300 text-red-700'}`}
                >
                  {item.pass ? 'Pass' : 'Fail'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
