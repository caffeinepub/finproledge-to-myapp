import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ComplianceDeliverable, DeliverableStatus } from '../backend';
import { calculateDaysRemaining, formatDeadline, isDueSoon } from '../utils/dateHelpers';
import { Clock, AlertTriangle } from 'lucide-react';

interface DeliverableCardProps {
  deliverable: ComplianceDeliverable;
}

export default function DeliverableCard({ deliverable }: DeliverableCardProps) {
  const daysRemaining = calculateDaysRemaining(deliverable.dueDate);
  const dueSoon = isDueSoon(deliverable.dueDate);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case DeliverableStatus.completed:
        return 'default';
      case DeliverableStatus.inProgress:
        return 'secondary';
      case DeliverableStatus.awaitingReview:
        return 'outline';
      case DeliverableStatus.overdue:
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case DeliverableStatus.notStarted:
        return 'Not Started';
      case DeliverableStatus.inProgress:
        return 'In Progress';
      case DeliverableStatus.awaitingReview:
        return 'Awaiting Review';
      case DeliverableStatus.completed:
        return 'Completed';
      case DeliverableStatus.overdue:
        return 'Overdue';
      default:
        return status;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'consulting':
        return 'Consulting';
      case 'monthly':
        return 'Monthly';
      case 'quarterly':
        return 'Quarterly';
      case 'annual':
        return 'Annual';
      default:
        return type;
    }
  };

  return (
    <Card className={dueSoon && deliverable.status !== DeliverableStatus.completed ? 'border-yellow-500/50 bg-yellow-500/5' : ''}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{deliverable.title}</CardTitle>
          <Badge variant={getStatusVariant(deliverable.status)}>
            {getStatusLabel(deliverable.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Type:</span>
          <span className="font-medium">{getTypeLabel(deliverable.deliverableType)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Due Date:</span>
          <span className="font-medium">{formatDeadline(deliverable.dueDate)}</span>
        </div>
        {deliverable.status !== DeliverableStatus.completed && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Days Remaining:</span>
              </div>
              <span className={`font-bold ${dueSoon ? 'text-yellow-600' : 'text-foreground'}`}>
                {daysRemaining}
              </span>
            </div>
            {dueSoon && (
              <div className="flex items-center gap-2 text-xs text-yellow-600 bg-yellow-500/10 p-2 rounded">
                <AlertTriangle className="h-3 w-3" />
                <span>Due within 5 days - Priority attention required</span>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
