import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, AlertTriangle } from 'lucide-react';
import { useGetAllComplianceDeliverables } from '../hooks/useDeliverables';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { DeliverableStatus } from '../backend';
import { calculateDaysRemaining } from '../utils/dateHelpers';

function ClientName({ principal }: { principal: string }) {
  const { data: profile, isLoading } = useGetUserProfileByPrincipal(principal);
  if (isLoading) return <span className="text-muted-foreground text-xs">Loading...</span>;
  if (!profile) return <span className="text-muted-foreground text-xs font-mono">{principal.slice(0, 12)}...</span>;
  return <span>{profile.name}</span>;
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

export default function ComplianceAdminDeadlineCountdown() {
  const { data: deliverables, isLoading } = useGetAllComplianceDeliverables();

  const sorted = useMemo(() => {
    if (!deliverables) return [];
    return [...deliverables]
      .filter(d => d.status !== DeliverableStatus.approved && d.status !== DeliverableStatus.rejected)
      .sort((a, b) => Number(a.dueDate) - Number(b.dueDate));
  }, [deliverables]);

  const criticalCount = sorted.filter(d => {
    const days = calculateDaysRemaining(d.dueDate);
    return days <= 5;
  }).length;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Deadline Countdown
        </CardTitle>
        <CardDescription>
          All upcoming filing deadlines sorted from soonest to latest. Items due within 5 days are highlighted.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : sorted.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No upcoming deadlines.</p>
          </div>
        ) : (
          <>
            {criticalCount > 0 && (
              <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>{criticalCount} deadline{criticalCount !== 1 ? 's' : ''}</strong> within the next 5 days — immediate action required!
                </p>
              </div>
            )}
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Client</TableHead>
                    <TableHead>Task</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Countdown</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sorted.map(d => {
                    const days = calculateDaysRemaining(d.dueDate);
                    const dueDateMs = Number(d.dueDate) / 1_000_000;
                    const dueDateStr = new Date(dueDateMs).toLocaleDateString('en-GB', {
                      day: 'numeric', month: 'short', year: 'numeric',
                    });
                    const isOverdue = days < 0;
                    const isCritical = days >= 0 && days <= 5;

                    return (
                      <TableRow
                        key={d.id.toString()}
                        className={
                          isOverdue
                            ? 'bg-red-50/60 dark:bg-red-950/20'
                            : isCritical
                            ? 'bg-amber-50/60 dark:bg-amber-950/20'
                            : ''
                        }
                      >
                        <TableCell className="font-medium text-sm">
                          <ClientName principal={d.client.toString()} />
                        </TableCell>
                        <TableCell className="font-medium">{d.title}</TableCell>
                        <TableCell>
                          <span className="text-xs text-muted-foreground">{getStatusLabel(d.status)}</span>
                        </TableCell>
                        <TableCell className="text-sm">{dueDateStr}</TableCell>
                        <TableCell>
                          {isOverdue ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300">
                              <AlertTriangle className="h-3 w-3" />
                              Overdue {Math.abs(days)}d
                            </span>
                          ) : isCritical ? (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300">
                              <AlertTriangle className="h-3 w-3" />
                              {days === 0 ? 'Due Today' : `${days}d left`}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                              <Clock className="h-3 w-3" />
                              {days}d
                            </span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
