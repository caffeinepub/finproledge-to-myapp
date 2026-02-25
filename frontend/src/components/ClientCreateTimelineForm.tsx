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
import { Loader2, AlertCircle } from 'lucide-react';
import { useCreateClientTimeline } from '../hooks/useComplianceAdmin';
import { TimelineStatus } from '../backend';
import { toast } from 'sonner';

interface ClientCreateTimelineFormProps {
  onSuccess: () => void;
}

function dateToNanoseconds(dateStr: string): bigint {
  return BigInt(new Date(dateStr).getTime()) * BigInt(1_000_000);
}

export default function ClientCreateTimelineForm({ onSuccess }: ClientCreateTimelineFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<TimelineStatus>(TimelineStatus.planned);
  const [error, setError] = useState('');

  const createClientTimeline = useCreateClientTimeline();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

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

    try {
      await createClientTimeline.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        startDate: dateToNanoseconds(startDate),
        endDate: dateToNanoseconds(endDate),
        status,
      });
      toast.success('Timeline entry created successfully!');
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create timeline entry.';
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="ctl-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ctl-title"
          placeholder="e.g. Document preparation phase"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={createClientTimeline.isPending}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ctl-description">Description</Label>
        <Textarea
          id="ctl-description"
          placeholder="Optional details about this timeline entry..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          disabled={createClientTimeline.isPending}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="ctl-start">
            Start Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="ctl-start"
            type="datetime-local"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            disabled={createClientTimeline.isPending}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ctl-end">
            End Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="ctl-end"
            type="datetime-local"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            disabled={createClientTimeline.isPending}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ctl-status">Status</Label>
        <Select
          value={status}
          onValueChange={v => setStatus(v as TimelineStatus)}
          disabled={createClientTimeline.isPending}
        >
          <SelectTrigger id="ctl-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TimelineStatus.planned}>Planned</SelectItem>
            <SelectItem value={TimelineStatus.inProgress}>In Progress</SelectItem>
            <SelectItem value={TimelineStatus.completed}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={createClientTimeline.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createClientTimeline.isPending}>
          {createClientTimeline.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {createClientTimeline.isPending ? 'Creating...' : 'Create Entry'}
        </Button>
      </div>
    </form>
  );
}
