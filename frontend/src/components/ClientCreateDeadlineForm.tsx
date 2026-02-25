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
import { useCreateClientDeadline } from '../hooks/useComplianceAdmin';
import { DeadlineStatus, UrgencyLevel } from '../backend';
import { toast } from 'sonner';

interface ClientCreateDeadlineFormProps {
  onSuccess: () => void;
}

function dateToNanoseconds(dateStr: string): bigint {
  return BigInt(new Date(dateStr).getTime()) * BigInt(1_000_000);
}

export default function ClientCreateDeadlineForm({ onSuccess }: ClientCreateDeadlineFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(UrgencyLevel.medium);
  const [status, setStatus] = useState<DeadlineStatus>(DeadlineStatus.active);
  const [error, setError] = useState('');

  const createClientDeadline = useCreateClientDeadline();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!dueDate) {
      setError('Due date is required.');
      return;
    }

    try {
      await createClientDeadline.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        dueDate: dateToNanoseconds(dueDate),
        urgencyLevel,
        status,
      });
      toast.success('Deadline created successfully!');
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create deadline.';
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
        <Label htmlFor="cdl-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cdl-title"
          placeholder="e.g. Submit annual tax return"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={createClientDeadline.isPending}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cdl-description">Description</Label>
        <Textarea
          id="cdl-description"
          placeholder="Optional details about this deadline..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          disabled={createClientDeadline.isPending}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cdl-due">
          Due Date <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cdl-due"
          type="datetime-local"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          disabled={createClientDeadline.isPending}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="cdl-urgency">Urgency Level</Label>
          <Select
            value={urgencyLevel}
            onValueChange={v => setUrgencyLevel(v as UrgencyLevel)}
            disabled={createClientDeadline.isPending}
          >
            <SelectTrigger id="cdl-urgency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={UrgencyLevel.high}>High</SelectItem>
              <SelectItem value={UrgencyLevel.medium}>Medium</SelectItem>
              <SelectItem value={UrgencyLevel.low}>Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cdl-status">Status</Label>
          <Select
            value={status}
            onValueChange={v => setStatus(v as DeadlineStatus)}
            disabled={createClientDeadline.isPending}
          >
            <SelectTrigger id="cdl-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DeadlineStatus.active}>Active</SelectItem>
              <SelectItem value={DeadlineStatus.completed}>Completed</SelectItem>
              <SelectItem value={DeadlineStatus.missed}>Missed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={createClientDeadline.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createClientDeadline.isPending}>
          {createClientDeadline.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {createClientDeadline.isPending ? 'Creating...' : 'Create Deadline'}
        </Button>
      </div>
    </form>
  );
}
