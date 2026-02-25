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
import { useCreateClientFollowUp } from '../hooks/useComplianceAdmin';
import { FollowUpStatus } from '../backend';
import { toast } from 'sonner';

interface ClientCreateFollowUpFormProps {
  onSuccess: () => void;
}

function dateToNanoseconds(dateStr: string): bigint {
  return BigInt(new Date(dateStr).getTime()) * BigInt(1_000_000);
}

export default function ClientCreateFollowUpForm({ onSuccess }: ClientCreateFollowUpFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<FollowUpStatus>(FollowUpStatus.pending);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const createClientFollowUp = useCreateClientFollowUp();

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
      await createClientFollowUp.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        dueDate: dateToNanoseconds(dueDate),
        status,
        notes: notes.trim(),
      });
      toast.success('Follow-up item created successfully!');
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create follow-up item.';
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
        <Label htmlFor="cfu-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="cfu-title"
          placeholder="e.g. Submit missing bank statements"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={createClientFollowUp.isPending}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cfu-description">Description</Label>
        <Textarea
          id="cfu-description"
          placeholder="Optional details..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          disabled={createClientFollowUp.isPending}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="cfu-due">
            Due Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="cfu-due"
            type="datetime-local"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            disabled={createClientFollowUp.isPending}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="cfu-status">Status</Label>
          <Select
            value={status}
            onValueChange={v => setStatus(v as FollowUpStatus)}
            disabled={createClientFollowUp.isPending}
          >
            <SelectTrigger id="cfu-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={FollowUpStatus.pending}>Pending</SelectItem>
              <SelectItem value={FollowUpStatus.completed}>Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cfu-notes">Notes</Label>
        <Textarea
          id="cfu-notes"
          placeholder="Any additional notes or context..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          disabled={createClientFollowUp.isPending}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={createClientFollowUp.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createClientFollowUp.isPending}>
          {createClientFollowUp.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {createClientFollowUp.isPending ? 'Creating...' : 'Create Follow-Up'}
        </Button>
      </div>
    </form>
  );
}
