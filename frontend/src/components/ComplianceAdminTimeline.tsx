import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart2, Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetAllComplianceDeliverables } from '../hooks/useDeliverables';
import { useGetAllTimelines } from '../hooks/useComplianceAdmin';
import { DeliverableStatus, TimelineStatus } from '../backend';
import CreateTimelineForm from './CreateTimelineForm';

function getDeliverableStatusColor(status: DeliverableStatus): string {
  switch (status) {
    case DeliverableStatus.drafting: return '#94a3b8';
    case DeliverableStatus.inReview: return '#3b82f6';
    case DeliverableStatus.completed: return '#22c55e';
    case DeliverableStatus.approved: return '#10b981';
    case DeliverableStatus.rejected: return '#ef4444';
    default: return '#94a3b8';
  }
}

function getDeliverableStatusLabel(status: DeliverableStatus): string {
  switch (status) {
    case DeliverableStatus.drafting: return 'Drafting';
    case DeliverableStatus.inReview: return 'In Review';
    case DeliverableStatus.completed: return 'Completed';
    case DeliverableStatus.approved: return 'Approved';
    case DeliverableStatus.rejected: return 'Rejected';
    default: return 'Unknown';
  }
}

function getTimelineStatusLabel(status: TimelineStatus): string {
  switch (status) {
    case TimelineStatus.planned: return 'Planned';
    case TimelineStatus.inProgress: return 'In Progress';
    case TimelineStatus.completed: return 'Completed';
    default: return 'Unknown';
  }
}

function getTimelineStatusColor(status: TimelineStatus): string {
  switch (status) {
    case TimelineStatus.planned: return 'bg-gray-100 text-gray-700 border-gray-200';
    case TimelineStatus.inProgress: return 'bg-blue-100 text-blue-700 border-blue-200';
    case TimelineStatus.completed: return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export default function ComplianceAdminTimeline() {
  const { data: deliverables, isLoading: delivLoading } = useGetAllComplianceDeliverables();
  const { data: timelines, isLoading: timelineLoading } = useGetAllTimelines();
  const [dialogOpen, setDialogOpen] = useState(false);

  const isLoading = delivLoading || timelineLoading;

  // Group deliverables by month
  const monthlyData = useMemo(() => {
    if (!deliverables || deliverables.length === 0) return [];

    const now = new Date();
    const months: { label: string; key: string; date: Date }[] = [];

    // Show 6 months: 2 past + current + 3 future
    for (let i = -2; i <= 3; i++) {
      const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
      months.push({
        label: d.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' }),
        key: `${d.getFullYear()}-${d.getMonth()}`,
        date: d,
      });
    }

    return months.map(month => {
      const nextMonth = new Date(month.date.getFullYear(), month.date.getMonth() + 1, 1);
      const tasks = deliverables.filter(d => {
        const due = new Date(Number(d.dueDate) / 1_000_000);
        return due >= month.date && due < nextMonth;
      });

      const byStatus: Record<string, number> = {};
      tasks.forEach(t => {
        const label = getDeliverableStatusLabel(t.status);
        byStatus[label] = (byStatus[label] || 0) + 1;
      });

      return {
        ...month,
        tasks,
        total: tasks.length,
        byStatus,
      };
    });
  }, [deliverables]);

  const maxTasks = useMemo(() => Math.max(...monthlyData.map(m => m.total), 1), [monthlyData]);

  // Individual task timeline (sorted by due date)
  const sortedTasks = useMemo(() => {
    if (!deliverables) return [];
    return [...deliverables].sort((a, b) => Number(a.dueDate) - Number(b.dueDate));
  }, [deliverables]);

  const timelineStart = useMemo(() => {
    if (sortedTasks.length === 0) return new Date();
    const first = new Date(Number(sortedTasks[0].dueDate) / 1_000_000);
    const now = new Date();
    return first < now ? first : now;
  }, [sortedTasks]);

  const timelineEnd = useMemo(() => {
    if (sortedTasks.length === 0) {
      const d = new Date();
      d.setMonth(d.getMonth() + 3);
      return d;
    }
    const last = new Date(Number(sortedTasks[sortedTasks.length - 1].dueDate) / 1_000_000);
    const future = new Date();
    future.setMonth(future.getMonth() + 1);
    return last > future ? last : future;
  }, [sortedTasks]);

  const totalMs = timelineEnd.getTime() - timelineStart.getTime();

  function getBarLeft(dueDate: bigint): number {
    const due = new Date(Number(dueDate) / 1_000_000);
    return Math.max(0, Math.min(100, ((due.getTime() - timelineStart.getTime()) / totalMs) * 100));
  }

  // Sort admin timeline entries by start date
  const sortedTimelines = useMemo(() => {
    if (!timelines) return [];
    return [...timelines].sort((a, b) => Number(a.startDate) - Number(b.startDate));
  }, [timelines]);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Timeline Entry</DialogTitle>
            <DialogDescription>
              Create a new timeline entry to track project phases and milestones.
            </DialogDescription>
          </DialogHeader>
          <CreateTimelineForm onSuccess={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {/* Admin Timeline Entries */}
        {(timelines && timelines.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Admin Timeline Entries
              </CardTitle>
              <CardDescription>
                Timeline entries created by the admin for project tracking.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {timelineLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Task Ref</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedTimelines.map(entry => {
                        const startMs = Number(entry.startDate) / 1_000_000;
                        const endMs = Number(entry.endDate) / 1_000_000;
                        const startStr = new Date(startMs).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                        const endStr = new Date(endMs).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
                        return (
                          <TableRow key={entry.id.toString()}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{entry.title}</p>
                                {entry.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{entry.description}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getTimelineStatusColor(entry.status)}`}>
                                {getTimelineStatusLabel(entry.status)}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">{startStr}</TableCell>
                            <TableCell className="text-sm">{endStr}</TableCell>
                            <TableCell className="text-sm text-muted-foreground">
                              {entry.taskReference != null ? `#${entry.taskReference}` : '—'}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Monthly Workload Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-primary" />
                  Monthly Workload Overview
                </CardTitle>
                <CardDescription>
                  Number of tasks due each month. Taller bars indicate busier periods.
                </CardDescription>
              </div>
              <Button
                onClick={() => setDialogOpen(true)}
                size="sm"
                className="shrink-0 flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add Timeline Entry
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <div className="space-y-4">
                {/* Bar Chart */}
                <div className="flex items-end gap-3 h-48 px-2">
                  {monthlyData.map(month => {
                    const heightPct = maxTasks > 0 ? (month.total / maxTasks) * 100 : 0;
                    const isCurrentMonth = month.date.getMonth() === new Date().getMonth() &&
                      month.date.getFullYear() === new Date().getFullYear();
                    return (
                      <div key={month.key} className="flex-1 flex flex-col items-center gap-1">
                        <span className="text-xs font-medium text-foreground">{month.total > 0 ? month.total : ''}</span>
                        <div className="w-full flex flex-col justify-end" style={{ height: '160px' }}>
                          <div
                            className={`w-full rounded-t-md transition-all ${isCurrentMonth ? 'bg-primary' : 'bg-primary/40'}`}
                            style={{ height: `${Math.max(heightPct, month.total > 0 ? 8 : 0)}%` }}
                            title={`${month.total} tasks`}
                          />
                        </div>
                        <span className={`text-xs ${isCurrentMonth ? 'font-bold text-primary' : 'text-muted-foreground'}`}>
                          {month.label}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-xs text-muted-foreground pt-2 border-t">
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-primary" />
                    <span>Current month</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded bg-primary/40" />
                    <span>Other months</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Gantt-style Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-primary" />
              Task Timeline
            </CardTitle>
            <CardDescription>
              Visual timeline of all tasks plotted by due date. Identify busy periods at a glance.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-8 w-full" />)}
              </div>
            ) : sortedTasks.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <BarChart2 className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No tasks to display on the timeline.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {/* Timeline header */}
                <div className="relative h-6 mb-4">
                  <div className="absolute left-0 text-xs text-muted-foreground">
                    {timelineStart.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}
                  </div>
                  <div className="absolute right-0 text-xs text-muted-foreground">
                    {timelineEnd.toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}
                  </div>
                  {/* Today marker */}
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-red-400"
                    style={{ left: `${getBarLeft(BigInt(new Date().getTime() * 1_000_000))}%` }}
                  >
                    <span className="absolute -top-5 -translate-x-1/2 text-xs text-red-500 font-medium whitespace-nowrap">Today</span>
                  </div>
                </div>

                {/* Task rows */}
                <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                  {sortedTasks.map(task => {
                    const left = getBarLeft(task.dueDate);
                    const dueDateStr = new Date(Number(task.dueDate) / 1_000_000).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short',
                    });
                    return (
                      <div key={task.id.toString()} className="flex items-center gap-2">
                        <div className="w-32 shrink-0 text-xs text-muted-foreground truncate" title={task.title}>
                          {task.title}
                        </div>
                        <div className="flex-1 relative h-6 bg-muted/30 rounded">
                          <div
                            className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 border-white shadow-sm"
                            style={{
                              left: `calc(${left}% - 6px)`,
                              backgroundColor: getDeliverableStatusColor(task.status),
                            }}
                            title={`${task.title} — ${dueDateStr}`}
                          />
                        </div>
                        <div className="w-16 shrink-0 text-xs text-muted-foreground text-right">{dueDateStr}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Status legend */}
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-3 border-t">
                  {[
                    { label: 'Drafting', color: '#94a3b8' },
                    { label: 'In Review', color: '#3b82f6' },
                    { label: 'Completed', color: '#22c55e' },
                    { label: 'Approved', color: '#10b981' },
                    { label: 'Rejected', color: '#ef4444' },
                  ].map(s => (
                    <div key={s.label} className="flex items-center gap-1.5">
                      <div className="w-3 h-3 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: s.color }} />
                      <span>{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
