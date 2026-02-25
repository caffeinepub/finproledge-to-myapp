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
import { useCreateDeadline } from '../hooks/useComplianceAdmin';
import { DeadlineStatus, UrgencyLevel } from '../backend';

interface CreateDeadlineFormProps {
  onSuccess: () => void;
}

function dateToNanoseconds(dateStr: string): bigint {
  return BigInt(new Date(dateStr).getTime()) * BigInt(1_000_000);
}

export default function CreateDeadlineForm({ onSuccess }: CreateDeadlineFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [urgencyLevel, setUrgencyLevel] = useState<UrgencyLevel>(UrgencyLevel.medium);
  const [status, setStatus] = useState<DeadlineStatus>(DeadlineStatus.active);
  const [deliverableReference, setDeliverableReference] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const createDeadline = useCreateDeadline();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }
    if (!dueDate) {
      setError('Due date is required.');
      return;
    }

    let deliverableRef: bigint | null = null;
    if (deliverableReference.trim()) {
      const parsed = parseInt(deliverableReference.trim(), 10);
      if (isNaN(parsed) || parsed < 0) {
        setError('Deliverable reference must be a valid non-negative number.');
        return;
      }
      deliverableRef = BigInt(parsed);
    }

    try {
      await createDeadline.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        dueDate: dateToNanoseconds(dueDate),
        urgencyLevel,
        status,
        deliverableReference: deliverableRef,
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create deadline record.';
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Deadline record created successfully!
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
        <Label htmlFor="dl-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="dl-title"
          placeholder="e.g. Corporate Tax Return Filing"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={createDeadline.isPending || success}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dl-description">Description</Label>
        <Textarea
          id="dl-description"
          placeholder="Optional details about this deadline..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          disabled={createDeadline.isPending || success}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="dl-due">
          Due Date <span className="text-destructive">*</span>
        </Label>
        <Input
          id="dl-due"
          type="datetime-local"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
          disabled={createDeadline.isPending || success}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="dl-urgency">Urgency Level</Label>
          <Select
            value={urgencyLevel}
            onValueChange={v => setUrgencyLevel(v as UrgencyLevel)}
            disabled={createDeadline.isPending || success}
          >
            <SelectTrigger id="dl-urgency">
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
          <Label htmlFor="dl-status">Status</Label>
          <Select
            value={status}
            onValueChange={v => setStatus(v as DeadlineStatus)}
            disabled={createDeadline.isPending || success}
          >
            <SelectTrigger id="dl-status">
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

      <div className="space-y-1.5">
        <Label htmlFor="dl-deliverable">Deliverable Reference (optional)</Label>
        <Input
          id="dl-deliverable"
          type="number"
          min="0"
          placeholder="e.g. 7"
          value={deliverableReference}
          onChange={e => setDeliverableReference(e.target.value)}
          disabled={createDeadline.isPending || success}
        />
        <p className="text-xs text-muted-foreground">Link to an existing deliverable ID if applicable.</p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={createDeadline.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createDeadline.isPending || success}>
          {createDeadline.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {createDeadline.isPending ? 'Creating...' : 'Create Deadline'}
        </Button>
      </div>
    </form>
  );
}
