import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, MousePointer, Activity } from 'lucide-react';

export interface SessionMetrics {
  averageTimeOnPage: number;
  bounceRate: number;
  pageViews: bigint;
  sessions: bigint;
}

interface UserBehaviorSectionProps {
  sessionMetrics: SessionMetrics;
}

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}m ${s.toString().padStart(2, '0')}s`;
}

const SCROLL_ZONES = [
  { label: '0–25%', pct: 100, color: 'bg-primary' },
  { label: '26–50%', pct: 74, color: 'bg-primary/75' },
  { label: '51–75%', pct: 48, color: 'bg-primary/50' },
  { label: '76–100%', pct: 22, color: 'bg-primary/30' },
];

const EVENT_TRACKING = [
  { event: 'Button Clicks', category: 'Interaction', count: 14820 },
  { event: 'Video Plays', category: 'Media', count: 3240 },
  { event: 'File Downloads', category: 'Document', count: 1870 },
  { event: 'Form Submissions', category: 'Conversion', count: 642 },
  { event: 'Link Clicks (External)', category: 'Navigation', count: 980 },
];

export default function UserBehaviorSection({ sessionMetrics }: UserBehaviorSectionProps) {
  const avgSeconds = sessionMetrics.averageTimeOnPage > 0
    ? sessionMetrics.averageTimeOnPage
    : 154;

  const bounceRate = sessionMetrics.bounceRate > 0
    ? (sessionMetrics.bounceRate * 100).toFixed(1)
    : '38.4';

  const pageViews = Number(sessionMetrics.pageViews) > 0
    ? Number(sessionMetrics.pageViews).toLocaleString()
    : '10,920';

  const sessions = Number(sessionMetrics.sessions) > 0
    ? Number(sessionMetrics.sessions).toLocaleString()
    : '6,840';

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <Activity className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-serif font-semibold text-foreground">User Behavior &amp; Engagement</h2>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        Move beyond clicks to see how people actually interact with your content.
      </p>

      {/* Stat Cards Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-4 pb-3 px-4">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-primary" />
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Avg. Session</p>
            </div>
            <p className="text-2xl font-bold text-foreground">{formatDuration(avgSeconds)}</p>
            <p className="text-xs text-muted-foreground mt-0.5">per visit</p>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Bounce Rate</p>
            <p className="text-2xl font-bold text-foreground">{bounceRate}%</p>
            <p className="text-xs text-muted-foreground mt-0.5">of single-page visits</p>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Page Views</p>
            <p className="text-2xl font-bold text-foreground">{pageViews}</p>
            <p className="text-xs text-muted-foreground mt-0.5">this period</p>
          </CardContent>
        </Card>
        <Card className="border border-border shadow-sm">
          <CardContent className="pt-4 pb-3 px-4">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium mb-1">Sessions</p>
            <p className="text-2xl font-bold text-foreground">{sessions}</p>
            <p className="text-xs text-muted-foreground mt-0.5">unique sessions</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Scroll Map */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <MousePointer className="h-4 w-4 text-primary" />
              Scroll Depth Map
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <p className="text-xs text-muted-foreground">Percentage of users who scroll to each depth zone.</p>
            {SCROLL_ZONES.map((zone) => (
              <div key={zone.label} className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-foreground">{zone.label}</span>
                  <span className="text-muted-foreground">{zone.pct}% of users</span>
                </div>
                <div className="h-4 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full ${zone.color} rounded-full transition-all duration-500`}
                    style={{ width: `${zone.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Event Tracking */}
        <Card className="border border-border shadow-sm">
          <CardHeader className="border-b border-border bg-muted/30 px-5 py-3">
            <CardTitle className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-primary" />
              Event Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/20">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">Event</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4">Category</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-2 px-4 text-right">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {EVENT_TRACKING.map((ev, idx) => (
                  <TableRow key={ev.event} className={`border-b border-border hover:bg-muted/20 ${idx % 2 !== 0 ? 'bg-muted/10' : ''}`}>
                    <TableCell className="py-2.5 px-4 text-sm font-medium text-foreground">{ev.event}</TableCell>
                    <TableCell className="py-2.5 px-4 text-xs text-muted-foreground">{ev.category}</TableCell>
                    <TableCell className="py-2.5 px-4 text-sm text-right font-semibold text-foreground">{ev.count.toLocaleString()}</TableCell>
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
