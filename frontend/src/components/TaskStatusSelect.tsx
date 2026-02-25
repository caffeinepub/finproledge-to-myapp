import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToDoStatus, TimelineStatus, FollowUpStatus, DeadlineStatus } from '../backend';
import {
  useUpdateClientToDoStatus,
  useUpdateClientTimelineStatus,
  useUpdateClientFollowUpStatus,
  useUpdateClientDeadlineStatus,
} from '../hooks/useComplianceAdmin';
import { toast } from 'sonner';

// ─── ToDo Status Select ───────────────────────────────────────────────────────

interface ToDoStatusSelectProps {
  taskId: bigint;
  currentStatus: ToDoStatus;
}

export function ToDoStatusSelect({ taskId, currentStatus }: ToDoStatusSelectProps) {
  const mutation = useUpdateClientToDoStatus();

  const handleChange = async (value: string) => {
    try {
      await mutation.mutateAsync({ toDoId: taskId, newStatus: value as ToDoStatus });
      toast.success('To-Do status updated.');
    } catch {
      toast.error('Failed to update status. Please try again.');
    }
  };

  return (
    <div className="flex items-center gap-1.5 min-w-[130px]">
      {mutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground shrink-0" />}
      <Select value={currentStatus} onValueChange={handleChange} disabled={mutation.isPending}>
        <SelectTrigger className="h-7 text-xs px-2 py-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ToDoStatus.pending}>Pending</SelectItem>
          <SelectItem value={ToDoStatus.inProgress}>In Progress</SelectItem>
          <SelectItem value={ToDoStatus.completed}>Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Timeline Status Select ───────────────────────────────────────────────────

interface TimelineStatusSelectProps {
  taskId: bigint;
  currentStatus: TimelineStatus;
}

export function TimelineStatusSelect({ taskId, currentStatus }: TimelineStatusSelectProps) {
  const mutation = useUpdateClientTimelineStatus();

  const handleChange = async (value: string) => {
    try {
      await mutation.mutateAsync({ timelineId: taskId, newStatus: value as TimelineStatus });
      toast.success('Timeline status updated.');
    } catch {
      toast.error('Failed to update status. Please try again.');
    }
  };

  return (
    <div className="flex items-center gap-1.5 min-w-[130px]">
      {mutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground shrink-0" />}
      <Select value={currentStatus} onValueChange={handleChange} disabled={mutation.isPending}>
        <SelectTrigger className="h-7 text-xs px-2 py-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={TimelineStatus.planned}>Planned</SelectItem>
          <SelectItem value={TimelineStatus.inProgress}>In Progress</SelectItem>
          <SelectItem value={TimelineStatus.completed}>Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── FollowUp Status Select ───────────────────────────────────────────────────

interface FollowUpStatusSelectProps {
  taskId: bigint;
  currentStatus: FollowUpStatus;
}

export function FollowUpStatusSelect({ taskId, currentStatus }: FollowUpStatusSelectProps) {
  const mutation = useUpdateClientFollowUpStatus();

  const handleChange = async (value: string) => {
    try {
      await mutation.mutateAsync({ followUpId: taskId, newStatus: value as FollowUpStatus });
      toast.success('Follow-Up status updated.');
    } catch {
      toast.error('Failed to update status. Please try again.');
    }
  };

  return (
    <div className="flex items-center gap-1.5 min-w-[120px]">
      {mutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground shrink-0" />}
      <Select value={currentStatus} onValueChange={handleChange} disabled={mutation.isPending}>
        <SelectTrigger className="h-7 text-xs px-2 py-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={FollowUpStatus.pending}>Pending</SelectItem>
          <SelectItem value={FollowUpStatus.completed}>Completed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// ─── Deadline Status Select ───────────────────────────────────────────────────

interface DeadlineStatusSelectProps {
  taskId: bigint;
  currentStatus: DeadlineStatus;
}

export function DeadlineStatusSelect({ taskId, currentStatus }: DeadlineStatusSelectProps) {
  const mutation = useUpdateClientDeadlineStatus();

  const handleChange = async (value: string) => {
    try {
      await mutation.mutateAsync({ deadlineId: taskId, newStatus: value as DeadlineStatus });
      toast.success('Deadline status updated.');
    } catch {
      toast.error('Failed to update status. Please try again.');
    }
  };

  return (
    <div className="flex items-center gap-1.5 min-w-[120px]">
      {mutation.isPending && <Loader2 className="h-3.5 w-3.5 animate-spin text-muted-foreground shrink-0" />}
      <Select value={currentStatus} onValueChange={handleChange} disabled={mutation.isPending}>
        <SelectTrigger className="h-7 text-xs px-2 py-0">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={DeadlineStatus.active}>Active</SelectItem>
          <SelectItem value={DeadlineStatus.completed}>Completed</SelectItem>
          <SelectItem value={DeadlineStatus.missed}>Missed</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
