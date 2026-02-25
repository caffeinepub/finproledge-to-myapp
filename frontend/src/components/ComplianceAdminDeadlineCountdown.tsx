import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Clock, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetAllComplianceDeliverables } from '../hooks/useDeliverables';
import { useGetAllDeadlines } from '../hooks/useComplianceAdmin';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { DeliverableStatus, DeadlineStatus, UrgencyLevel } from '../backend';
import { calculateDaysRemaining } from '../utils/dateHelpers';
import CreateDeadlineForm from './CreateDeadlineForm';

function ClientName({ principal }: { principal: string }) {
  const { data: profile, isLoading } = useGetUserProfileByPrincipal(principal);
  if (isLoading) return <span className="text-muted-foreground text-xs">Loading...</span>;
  if (!profile) return <span className="text-muted-foreground text-xs font-mono">{principal.slice(0, 12)}...</span>;
  return <span>{profile.name}</span>;
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

function getDeadlineStatusLabel(status: DeadlineStatus): string {
  switch (status) {
    case DeadlineStatus.active: return 'Active';
    case DeadlineStatus.completed: return 'Completed';
    case DeadlineStatus.missed: return 'Missed';
    default: return 'Unknown';
  }
}

function getDeadlineStatusColor(status: DeadlineStatus): string {
  switch (status) {
    case DeadlineStatus.active: return 'bg-blue-100 text-blue-700 border-blue-200';
    case DeadlineStatus.completed: return 'bg-green-100 text-green-700 border-green-200';
    case DeadlineStatus.missed: return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function getUrgencyLabel(level: UrgencyLevel): string {
  switch (level) {
    case UrgencyLevel.high: return 'High';
    case UrgencyLevel.medium: return 'Medium';
    case UrgencyLevel.low: return 'Low';
    default: return 'Unknown';
  }
}

function getUrgencyColor(level: UrgencyLevel): string {
  switch (level) {
    case UrgencyLevel.high: return 'bg-red-100 text-red-700 border-red-200';
    case UrgencyLevel.medium: return 'bg-amber-100 text-amber-700 border-amber-200';
    case UrgencyLevel.low: return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

export default function ComplianceAdminDeadlineCountdown() {
  const { data: deliverables, isLoading: delivLoading } = useGetAllComplianceDeliverables();
  const { data: deadlines, isLoading: deadlineLoading } = useGetAllDeadlines();
  const [dialogOpen, setDialogOpen] = useState(false);

  const isLoading = delivLoading || deadlineLoading;

  // Client compliance deliverables sorted
  const sortedDeliverables = useMemo(() => {
    if (!deliverables) return [];
    return [...deliverables]
      .filter(d => d.status !== DeliverableStatus.approved && d.status !== DeliverableStatus.rejected)
      .sort((a, b) => Number(a.dueDate) - Number(b.dueDate));
  }, [deliverables]);

  // Admin deadline records sorted
  const sortedDeadlines = useMemo(() => {
    if (!deadlines) return [];
    return [...deadlines]
      .filter(d => d.status === DeadlineStatus.active)
      .sort((a, b) => Number(a.dueDate) - Number(b.dueDate));
  }, [deadlines]);

  const criticalDeliverableCount = sortedDeliverables.filter(d => {
    const days = calculateDaysRemaining(d.dueDate);
    return days <= 5;
  }).length;

  const criticalDeadlineCount = sortedDeadlines.filter(d => {
    const days = calculateDaysRemaining(d.dueDate);
    return days <= 5;
  }).length;

  const totalCritical = criticalDeliverableCount + criticalDeadlineCount;

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Deadline Record</DialogTitle>
            <DialogDescription>
              Create a new deadline record to track important filing and compliance dates.
            </DialogDescription>
          </DialogHeader>
          <CreateDeadlineForm onSuccess={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {/* Admin Deadline Records */}
        {(deadlines && deadlines.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Admin Deadline Records
              </CardTitle>
              <CardDescription>
                Deadline records created directly by the admin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {deadlineLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
                </div>
              ) : (
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Urgency</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Countdown</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedDeadlines.map(dl => {
                        const days = calculateDaysRemaining(dl.dueDate);
                        const dueDateMs = Number(dl.dueDate) / 1_000_000;
                        const dueDateStr = new Date(dueDateMs).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        });
                        const isOverdue = days < 0;
                        const isCritical = days >= 0 && days <= 5;
                        return (
                          <TableRow
                            key={dl.id.toString()}
                            className={isOverdue ? 'bg-red-50/60 dark:bg-red-950/20' : isCritical ? 'bg-amber-50/60 dark:bg-amber-950/20' : ''}
                          >
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{dl.title}</p>
                                {dl.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{dl.description}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getUrgencyColor(dl.urgencyLevel)}`}>
                                {getUrgencyLabel(dl.urgencyLevel)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getDeadlineStatusColor(dl.status)}`}>
                                {getDeadlineStatusLabel(dl.status)}
                              </span>
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
              )}
            </CardContent>
          </Card>
        )}

        {/* Client Compliance Deadlines */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-primary" />
                  Deadline Countdown
                </CardTitle>
                <CardDescription>
                  All upcoming filing deadlines sorted from soonest to latest. Items due within 5 days are highlighted.
                </CardDescription>
              </div>
              <Button
                onClick={() => setDialogOpen(true)}
                size="sm"
                className="shrink-0 flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add Deadline
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : sortedDeliverables.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Clock className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p>No upcoming deadlines.</p>
              </div>
            ) : (
              <>
                {totalCritical > 0 && (
                  <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800">
                    <AlertTriangle className="h-4 w-4 text-red-600 shrink-0" />
                    <p className="text-sm text-red-800 dark:text-red-200">
                      <strong>{totalCritical} deadline{totalCritical !== 1 ? 's' : ''}</strong> within the next 5 days — immediate action required!
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
                      {sortedDeliverables.map(d => {
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
                              <span className="text-xs text-muted-foreground">{getDeliverableStatusLabel(d.status)}</span>
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
      </div>
    </>
  );
}
