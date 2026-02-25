import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Bell, AlertTriangle } from 'lucide-react';
import { useGetAllComplianceDeliverables } from '../hooks/useDeliverables';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { DeliverableStatus } from '../backend';

function getStatusColor(status: DeliverableStatus): string {
  switch (status) {
    case DeliverableStatus.drafting: return 'bg-gray-100 text-gray-700 border-gray-200';
    case DeliverableStatus.inReview: return 'bg-blue-100 text-blue-700 border-blue-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function getStatusLabel(status: DeliverableStatus): string {
  switch (status) {
    case DeliverableStatus.drafting: return 'Drafting';
    case DeliverableStatus.inReview: return 'In Review';
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
  // Use dueDate as a proxy for how long the task has been around
  // In a real scenario, we'd use createdAt. We'll calculate days from dueDate backwards.
  const now = Date.now();
  const due = Number(dueDate) / 1_000_000;
  // Estimate: tasks stuck = days since due date (if overdue) or days until due (as urgency)
  const diffMs = now - due;
  return Math.floor(diffMs / (1000 * 60 * 60 * 24));
}

export default function ComplianceAdminFollowUp() {
  const { data: deliverables, isLoading } = useGetAllComplianceDeliverables();

  const stuckItems = useMemo(() => {
    if (!deliverables) return [];
    return deliverables
      .filter(d => d.status === DeliverableStatus.inReview || d.status === DeliverableStatus.drafting)
      .sort((a, b) => Number(a.dueDate) - Number(b.dueDate)); // oldest due date first
  }, [deliverables]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Follow-Up Required
        </CardTitle>
        <CardDescription>
          Deliverables currently in "Drafting" or "In Review" status. These clients may need a nudge to keep things moving.
        </CardDescription>
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
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(d.status)}`}>
                            {getStatusLabel(d.status)}
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
  );
}
