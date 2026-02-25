import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BarChart2 } from 'lucide-react';
import { useGetAllComplianceDeliverables } from '../hooks/useDeliverables';
import { DeliverableStatus } from '../backend';

function getStatusColor(status: DeliverableStatus): string {
  switch (status) {
    case DeliverableStatus.drafting: return '#94a3b8';
    case DeliverableStatus.inReview: return '#3b82f6';
    case DeliverableStatus.completed: return '#22c55e';
    case DeliverableStatus.approved: return '#10b981';
    case DeliverableStatus.rejected: return '#ef4444';
    default: return '#94a3b8';
  }
}

function getStatusLabel(status: DeliverableStatus): string {
  switch (status) {
    case DeliverableStatus.drafting: return 'Drafting';
    case DeliverableStatus.inReview: return 'In Review';
    case DeliverableStatus.completed: return 'Completed';
    case DeliverableStatus.approved: return 'Approved';
    case DeliverableStatus.rejected: return 'Rejected';
    default: return 'Unknown';
  }
}

export default function ComplianceAdminTimeline() {
  const { data: deliverables, isLoading } = useGetAllComplianceDeliverables();

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
        const label = getStatusLabel(t.status);
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

  return (
    <div className="space-y-6">
      {/* Monthly Workload Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-primary" />
            Monthly Workload Overview
          </CardTitle>
          <CardDescription>
            Number of tasks due each month. Taller bars indicate busier periods.
          </CardDescription>
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
                      <div className="flex-1 relative h-6 bg-muted rounded">
                        <div
                          className="absolute top-1 h-4 w-3 rounded-sm"
                          style={{
                            left: `calc(${left}% - 6px)`,
                            backgroundColor: getStatusColor(task.status),
                          }}
                          title={`${task.title} — Due ${dueDateStr}`}
                        />
                      </div>
                      <div className="w-16 shrink-0 text-xs text-muted-foreground text-right">{dueDateStr}</div>
                    </div>
                  );
                })}
              </div>

              {/* Status legend */}
              <div className="flex flex-wrap gap-3 pt-3 border-t text-xs">
                {[
                  { status: DeliverableStatus.drafting, label: 'Drafting' },
                  { status: DeliverableStatus.inReview, label: 'In Review' },
                  { status: DeliverableStatus.completed, label: 'Completed' },
                  { status: DeliverableStatus.approved, label: 'Approved' },
                  { status: DeliverableStatus.rejected, label: 'Rejected' },
                ].map(({ status, label }) => (
                  <div key={status} className="flex items-center gap-1.5">
                    <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: getStatusColor(status) }} />
                    <span className="text-muted-foreground">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
