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
import { useCreateFollowUp } from '../hooks/useComplianceAdmin';
import { FollowUpStatus } from '../backend';

interface CreateFollowUpFormProps {
  onSuccess: () => void;
}

function dateToNanoseconds(dateStr: string): bigint {
  return BigInt(new Date(dateStr).getTime()) * BigInt(1_000_000);
}

export default function CreateFollowUpForm({ onSuccess }: CreateFollowUpFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [clientReference, setClientReference] = useState('');
  const [status, setStatus] = useState<FollowUpStatus>(FollowUpStatus.pending);
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const createFollowUp = useCreateFollowUp();

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

    // Validate principal format if provided
    if (clientReference.trim()) {
      try {
        const { Principal } = await import('@dfinity/principal');
        Principal.fromText(clientReference.trim());
      } catch {
        setError('Invalid client principal ID format.');
        return;
      }
    }

    try {
      await createFollowUp.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        dueDate: dateToNanoseconds(dueDate),
        clientReference: clientReference.trim() || null,
        status,
        notes: notes.trim(),
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create follow-up item.';
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            Follow-up item created successfully!
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
        <Label htmlFor="fu-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="fu-title"
          placeholder="e.g. Follow up with client on missing documents"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={createFollowUp.isPending || success}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fu-description">Description</Label>
        <Textarea
          id="fu-description"
          placeholder="Optional details..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={2}
          disabled={createFollowUp.isPending || success}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="fu-due">
            Due Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="fu-due"
            type="datetime-local"
            value={dueDate}
            onChange={e => setDueDate(e.target.value)}
            disabled={createFollowUp.isPending || success}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="fu-status">Status</Label>
          <Select
            value={status}
            onValueChange={v => setStatus(v as FollowUpStatus)}
            disabled={createFollowUp.isPending || success}
          >
            <SelectTrigger id="fu-status">
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
        <Label htmlFor="fu-client">Client Reference Principal (optional)</Label>
        <Input
          id="fu-client"
          placeholder="e.g. aaaaa-aa (Principal ID)"
          value={clientReference}
          onChange={e => setClientReference(e.target.value)}
          disabled={createFollowUp.isPending || success}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">Leave blank if not linked to a specific client.</p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="fu-notes">Notes</Label>
        <Textarea
          id="fu-notes"
          placeholder="Any additional notes or context..."
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={2}
          disabled={createFollowUp.isPending || success}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={createFollowUp.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createFollowUp.isPending || success}>
          {createFollowUp.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {createFollowUp.isPending ? 'Creating...' : 'Create Follow-Up'}
        </Button>
      </div>
    </form>
  );
}
