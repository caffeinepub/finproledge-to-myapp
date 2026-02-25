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
import { Bell, AlertTriangle, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetAllComplianceDeliverables } from '../hooks/useDeliverables';
import { useGetAllFollowUps } from '../hooks/useComplianceAdmin';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { DeliverableStatus, FollowUpStatus } from '../backend';
import CreateFollowUpForm from './CreateFollowUpForm';

function getDeliverableStatusColor(status: DeliverableStatus): string {
  switch (status) {
    case DeliverableStatus.drafting: return 'bg-gray-100 text-gray-700 border-gray-200';
    case DeliverableStatus.inReview: return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function getDeliverableStatusLabel(status: DeliverableStatus): string {
  switch (status) {
    case DeliverableStatus.drafting: return 'Drafting';
    case DeliverableStatus.inReview: return 'In Review';
    default: return 'Unknown';
  }
}

function getFollowUpStatusColor(status: FollowUpStatus): string {
  switch (status) {
    case FollowUpStatus.pending: return 'bg-amber-100 text-amber-700 border-amber-200';
    case FollowUpStatus.completed: return 'bg-green-100 text-green-700 border-green-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function getFollowUpStatusLabel(status: FollowUpStatus): string {
  switch (status) {
    case FollowUpStatus.pending: return 'Pending';
    case FollowUpStatus.completed: return 'Completed';
    default: return 'Unknown';
  }
}

function ClientName({ principal }: { principal: string }) {
  const { data: profile, isLoading } = useGetUserProfileByPrincipal(principal);
  if (isLoading) return <span className="text-muted-foreground text-xs">Loading...</span>;
  if (!profile) return <span className="text-muted-foreground text-xs font-mono">{principal.slice(0, 12)}...</span>;
  return <span>{profile.name}</span>;
}

function getDaysStuck(dueDate: bigint): number {
  const now = Date.now();
  const due = Number(dueDate) / 1_000_000;
  const diffMs = now - due;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export default function ComplianceAdminFollowUp() {
  const { data: deliverables, isLoading: delivLoading } = useGetAllComplianceDeliverables();
  const { data: followUps, isLoading: followUpLoading } = useGetAllFollowUps();
  const [dialogOpen, setDialogOpen] = useState(false);

  const isLoading = delivLoading || followUpLoading;

  const stuckItems = useMemo(() => {
    if (!deliverables) return [];
    return deliverables
      .filter(d => d.status === DeliverableStatus.inReview || d.status === DeliverableStatus.drafting)
      .sort((a, b) => Number(a.dueDate) - Number(b.dueDate));
  }, [deliverables]);

  const sortedFollowUps = useMemo(() => {
    if (!followUps) return [];
    return [...followUps].sort((a, b) => Number(a.dueDate) - Number(b.dueDate));
  }, [followUps]);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Follow-Up Item</DialogTitle>
            <DialogDescription>
              Create a new follow-up item to track client communications and pending actions.
            </DialogDescription>
          </DialogHeader>
          <CreateFollowUpForm onSuccess={() => setDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      <div className="space-y-6">
        {/* Admin Follow-Up Items */}
        {(followUps && followUps.length > 0) && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Admin Follow-Up Items
              </CardTitle>
              <CardDescription>
                Follow-up items created directly by the admin.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {followUpLoading ? (
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
                        <TableHead>Due Date</TableHead>
                        <TableHead>Client Reference</TableHead>
                        <TableHead>Notes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sortedFollowUps.map(fu => {
                        const dueDateMs = Number(fu.dueDate) / 1_000_000;
                        const dueDateStr = new Date(dueDateMs).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        });
                        const now = Date.now();
                        const isOverdue = dueDateMs < now && fu.status === FollowUpStatus.pending;
                        return (
                          <TableRow key={fu.id.toString()} className={isOverdue ? 'bg-red-50/40 dark:bg-red-950/10' : ''}>
                            <TableCell>
                              <div>
                                <p className="font-medium text-sm">{fu.title}</p>
                                {fu.description && (
                                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{fu.description}</p>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getFollowUpStatusColor(fu.status)}`}>
                                {getFollowUpStatusLabel(fu.status)}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">{dueDateStr}</TableCell>
                            <TableCell className="text-sm">
                              {fu.clientReference
                                ? <ClientName principal={fu.clientReference.toString()} />
                                : <span className="text-muted-foreground text-xs">—</span>
                              }
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground max-w-xs">
                              <span className="line-clamp-1">{fu.notes || '—'}</span>
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

        {/* Client Stuck Items */}
        <Card>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="h-5 w-5 text-primary" />
                  Follow-Up Required
                </CardTitle>
                <CardDescription>
                  Deliverables currently in "Drafting" or "In Review" status. These clients may need a nudge to keep things moving.
                </CardDescription>
              </div>
              <Button
                onClick={() => setDialogOpen(true)}
                size="sm"
                className="shrink-0 flex items-center gap-1.5"
              >
                <Plus className="h-4 w-4" />
                Add Follow-Up
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-12 w-full" />)}
              </div>
            ) : stuckItems.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">
                <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">All clear!</p>
                <p className="text-sm">No items are currently stuck in review.</p>
              </div>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-4 p-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                  <p className="text-sm text-amber-800 dark:text-amber-200">
                    <strong>{stuckItems.length} item{stuckItems.length !== 1 ? 's' : ''}</strong> need follow-up action.
                  </p>
                </div>
                <div className="rounded-md border overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Client</TableHead>
                        <TableHead>Task Title</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Due Date</TableHead>
                        <TableHead>Days Overdue / Until Due</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {stuckItems.map(d => {
                        const dueDateMs = Number(d.dueDate) / 1_000_000;
                        const dueDateStr = new Date(dueDateMs).toLocaleDateString('en-GB', {
                          day: 'numeric', month: 'short', year: 'numeric',
                        });
                        const daysStuck = getDaysStuck(d.dueDate);
                        const isOverdue = daysStuck > 0;

                        return (
                          <TableRow key={d.id.toString()} className={isOverdue ? 'bg-red-50/40 dark:bg-red-950/10' : ''}>
                            <TableCell className="font-medium text-sm">
                              <ClientName principal={d.client.toString()} />
                            </TableCell>
                            <TableCell className="font-medium">{d.title}</TableCell>
                            <TableCell>
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getDeliverableStatusColor(d.status)}`}>
                                {getDeliverableStatusLabel(d.status)}
                              </span>
                            </TableCell>
                            <TableCell className="text-sm">{dueDateStr}</TableCell>
                            <TableCell>
                              {isOverdue ? (
                                <span className="text-xs font-bold text-red-600 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  {daysStuck}d overdue
                                </span>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  {Math.abs(daysStuck)}d until due
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
