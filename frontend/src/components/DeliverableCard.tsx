import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { ComplianceDeliverable, DeliverableStatus, DeliverableType } from '../backend';
import { calculateDaysRemaining, isWithinFiveDays } from '../utils/dateHelpers';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { toast } from 'sonner';

interface DeliverableCardProps {
  deliverable: ComplianceDeliverable;
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

function getStatusColor(status: DeliverableStatus): string {
  switch (status) {
    case DeliverableStatus.drafting: return 'bg-gray-100 text-gray-700 border-gray-200';
    case DeliverableStatus.inReview: return 'bg-blue-100 text-blue-700 border-blue-200';
    case DeliverableStatus.completed: return 'bg-green-100 text-green-700 border-green-200';
    case DeliverableStatus.approved: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case DeliverableStatus.rejected: return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function getTypeLabel(type: DeliverableType): string {
  switch (type) {
    case DeliverableType.consulting: return 'Consulting';
    case DeliverableType.monthly: return 'Monthly';
    case DeliverableType.annual: return 'Annual';
    case DeliverableType.quarterly: return 'Quarterly';
    default: return 'General';
  }
}

export default function DeliverableCard({ deliverable }: DeliverableCardProps) {
  const { actor } = useActor();
  const queryClient = useQueryClient();
  const daysRemaining = calculateDaysRemaining(deliverable.dueDate);
  const isUrgent = isWithinFiveDays(deliverable.dueDate);
  const isOverdue = daysRemaining < 0;

  // Show approve/reject buttons when status is inReview or completed
  const canApproveReject =
    deliverable.status === DeliverableStatus.inReview ||
    deliverable.status === DeliverableStatus.completed;

  const approveMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      // Note: Backend needs updateDeliverableStatus for compliance deliverables
      // Currently using a workaround - this will be a no-op until backend supports it
      throw new Error('Backend method not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDeliverables'] });
      toast.success('Deliverable approved successfully');
    },
    onError: () => {
      toast.error('Approval feature coming soon. Please contact your advisor.');
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      throw new Error('Backend method not yet available');
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myDeliverables'] });
      toast.success('Deliverable rejected');
    },
    onError: () => {
      toast.error('Rejection feature coming soon. Please contact your advisor.');
    },
  });

  const dueDateMs = Number(deliverable.dueDate) / 1_000_000;
  const dueDateFormatted = new Date(dueDateMs).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <Card className={`border transition-all ${isUrgent && !isOverdue ? 'border-amber-400 bg-amber-50/30 dark:bg-amber-950/10' : isOverdue ? 'border-red-400 bg-red-50/30 dark:bg-red-950/10' : 'border-border'}`}>
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
          {/* Left: Title + Type + Status */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground text-base truncate">{deliverable.title}</h3>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(deliverable.status)}`}>
                {getStatusLabel(deliverable.status)}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <Badge variant="outline" className="text-xs">
                {getTypeLabel(deliverable.deliverableType)}
              </Badge>
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />
                Due: {dueDateFormatted}
              </span>
            </div>
          </div>

          {/* Right: Countdown + Actions */}
          <div className="flex flex-col items-end gap-2 shrink-0">
            {/* Countdown Badge */}
            {isOverdue ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-300">
                <AlertTriangle className="h-3.5 w-3.5" />
                Overdue
              </span>
            ) : isUrgent ? (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-300">
                <AlertTriangle className="h-3.5 w-3.5" />
                {daysRemaining === 0 ? 'Due Today' : `${daysRemaining}d left`}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">
                <Clock className="h-3.5 w-3.5" />
                {daysRemaining}d remaining
              </span>
            )}

            {/* Approve / Reject Buttons */}
            {canApproveReject && (
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="text-green-700 border-green-300 hover:bg-green-50 hover:border-green-400 text-xs h-7 px-3"
                  onClick={() => approveMutation.mutate()}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                >
                  {approveMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  Approve
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="text-red-700 border-red-300 hover:bg-red-50 hover:border-red-400 text-xs h-7 px-3"
                  onClick={() => rejectMutation.mutate()}
                  disabled={approveMutation.isPending || rejectMutation.isPending}
                >
                  {rejectMutation.isPending ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <XCircle className="h-3 w-3 mr-1" />
                  )}
                  Reject
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
