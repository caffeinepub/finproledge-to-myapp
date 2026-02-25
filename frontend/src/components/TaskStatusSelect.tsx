import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ToDoStatus, TimelineStatus, FollowUpStatus } from '../backend';
import { toast } from 'sonner';
import { useUpdateToDoStatus, useUpdateTimelineStatus, useUpdateFollowUpStatus } from '../hooks/useComplianceAdmin';

interface ToDoStatusSelectProps {
  toDoId: bigint;
  currentStatus: ToDoStatus;
}

export function ToDoStatusSelect({ toDoId, currentStatus }: ToDoStatusSelectProps) {
  const [optimisticStatus, setOptimisticStatus] = useState<ToDoStatus>(currentStatus);
  const updateStatus = useUpdateToDoStatus();

  const handleChange = async (value: string) => {
    const newStatus = value as ToDoStatus;
    const previousStatus = optimisticStatus;
    setOptimisticStatus(newStatus);
    try {
      await updateStatus.mutateAsync({ toDoId, newStatus });
      toast.success('Status updated');
    } catch {
      setOptimisticStatus(previousStatus);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex items-center gap-1">
      {updateStatus.isPending && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
      <Select value={optimisticStatus} onValueChange={handleChange} disabled={updateStatus.isPending}>
        <SelectTrigger className="h-7 text-xs w-32">
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

interface TimelineStatusSelectProps {
  timelineId: bigint;
  currentStatus: TimelineStatus;
}

export function TimelineStatusSelect({ timelineId, currentStatus }: TimelineStatusSelectProps) {
  const [optimisticStatus, setOptimisticStatus] = useState<TimelineStatus>(currentStatus);
  const updateStatus = useUpdateTimelineStatus();

  const handleChange = async (value: string) => {
    const newStatus = value as TimelineStatus;
    const previousStatus = optimisticStatus;
    setOptimisticStatus(newStatus);
    try {
      await updateStatus.mutateAsync({ timelineId, newStatus });
      toast.success('Status updated');
    } catch {
      setOptimisticStatus(previousStatus);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex items-center gap-1">
      {updateStatus.isPending && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
      <Select value={optimisticStatus} onValueChange={handleChange} disabled={updateStatus.isPending}>
        <SelectTrigger className="h-7 text-xs w-32">
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

interface FollowUpStatusSelectProps {
  followUpId: bigint;
  currentStatus: FollowUpStatus;
}

export function FollowUpStatusSelect({ followUpId, currentStatus }: FollowUpStatusSelectProps) {
  const [optimisticStatus, setOptimisticStatus] = useState<FollowUpStatus>(currentStatus);
  const updateStatus = useUpdateFollowUpStatus();

  const handleChange = async (value: string) => {
    const newStatus = value as FollowUpStatus;
    const previousStatus = optimisticStatus;
    setOptimisticStatus(newStatus);
    try {
      await updateStatus.mutateAsync({ followUpId, newStatus });
      toast.success('Status updated');
    } catch {
      setOptimisticStatus(previousStatus);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="flex items-center gap-1">
      {updateStatus.isPending && <Loader2 className="w-3 h-3 animate-spin text-muted-foreground" />}
      <Select value={optimisticStatus} onValueChange={handleChange} disabled={updateStatus.isPending}>
        <SelectTrigger className="h-7 text-xs w-32">
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
