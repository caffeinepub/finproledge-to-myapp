import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useCreateTimeline } from '../hooks/useComplianceAdmin';
import { TimelineStatus } from '../backend';

interface CreateTimelineFormProps {
  onSuccess: () => void;
}

function dateToNanoseconds(dateStr: string): bigint {
  return BigInt(new Date(dateStr).getTime()) * BigInt(1_000_000);
}

export default function CreateTimelineForm({ onSuccess }: CreateTimelineFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<TimelineStatus>(TimelineStatus.planned);
  const [taskReference, setTaskReference] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const createTimeline = useCreateTimeline();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!startDate) {
      setError('Start date is required.');
      return;
    }
    if (!endDate) {
      setError('End date is required.');
      return;
    }
    if (new Date(endDate) < new Date(startDate)) {
      setError('End date must be after start date.');
      return;
    }

    let taskRef: bigint | null = null;
    if (taskReference.trim()) {
      const parsed = parseInt(taskReference.trim(), 10);
      if (isNaN(parsed) || parsed < 0) {
        setError('Task reference must be a valid non-negative number.');
        return;
      }
      taskRef = BigInt(parsed);
    }

    try {
      await createTimeline.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        startDate: dateToNanoseconds(startDate),
        endDate: dateToNanoseconds(endDate),
        status,
        taskReference: taskRef,
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create timeline entry.';
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Timeline entry created successfully!
          </AlertDescription>
        </Alert>
      )}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="tl-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="tl-title"
          placeholder="e.g. Annual Audit Phase 1"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={createTimeline.isPending || success}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="tl-description">Description</Label>
        <Textarea
          id="tl-description"
          placeholder="Optional details about this timeline entry..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          disabled={createTimeline.isPending || success}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="tl-start">
            Start Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="tl-start"
            type="datetime-local"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            disabled={createTimeline.isPending || success}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="tl-end">
            End Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="tl-end"
            type="datetime-local"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            disabled={createTimeline.isPending || success}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="tl-status">Status</Label>
          <Select
            value={status}
            onValueChange={v => setStatus(v as TimelineStatus)}
            disabled={createTimeline.isPending || success}
          >
            <SelectTrigger id="tl-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TimelineStatus.planned}>Planned</SelectItem>
              <SelectItem value={TimelineStatus.inProgress}>In Progress</SelectItem>
              <SelectItem value={TimelineStatus.completed}>Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="tl-taskref">Task Reference (optional)</Label>
          <Input
            id="tl-taskref"
            type="number"
            min="0"
            placeholder="e.g. 42"
            value={taskReference}
            onChange={e => setTaskReference(e.target.value)}
            disabled={createTimeline.isPending || success}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={createTimeline.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createTimeline.isPending || success}>
          {createTimeline.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {createTimeline.isPending ? 'Creating...' : 'Create Entry'}
        </Button>
      </div>
    </form>
  );
}
