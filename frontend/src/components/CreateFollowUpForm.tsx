import { useState } from 'react';
import { FollowUpStatus } from '../backend';
import { useCreateFollowUp } from '../hooks/useComplianceAdmin';
import { useListApprovals } from '../hooks/useApprovals';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
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
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import { ApprovalStatus } from '../backend';

interface CreateFollowUpFormProps {
  onSuccess?: () => void;
}

function ClientOption({ principalStr }: { principalStr: string }) {
  const { data: profile } = useGetUserProfileByPrincipal(principalStr);
  return (
    <SelectItem value={principalStr}>
      {profile ? `${profile.name} (${profile.email})` : principalStr.slice(0, 20) + '…'}
    </SelectItem>
  );
}

export default function CreateFollowUpForm({ onSuccess }: CreateFollowUpFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<FollowUpStatus>(FollowUpStatus.pending);
  const [notes, setNotes] = useState('');
  const [clientReferenceStr, setClientReferenceStr] = useState<string>('');

  const createFollowUp = useCreateFollowUp();
  const { data: approvals } = useListApprovals();

  const approvedClients = approvals?.filter(
    (a) => a.status === ApprovalStatus.approved
  ) ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      toast.error('Title and due date are required');
      return;
    }

    try {
      const dueDateNs = BigInt(new Date(dueDate).getTime()) * BigInt(1_000_000);

      const { Principal } = await import('@dfinity/principal');
      const principal = clientReferenceStr ? Principal.fromText(clientReferenceStr) : null;

      await createFollowUp.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        dueDate: dueDateNs,
        clientReference: principal,
        status,
        notes: notes.trim(),
      });

      toast.success('Follow-Up created successfully!');
      setTitle('');
      setDescription('');
      setDueDate('');
      setStatus(FollowUpStatus.pending);
      setNotes('');
      setClientReferenceStr('');
      onSuccess?.();
    } catch (err) {
      toast.error('Failed to create Follow-Up. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter follow-up title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description..."
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dueDate">
            Due Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as FollowUpStatus)}>
            <SelectTrigger id="status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={FollowUpStatus.pending}>Pending</SelectItem>
              <SelectItem value={FollowUpStatus.completed}>Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientReference">Assign to Client</Label>
        <Select value={clientReferenceStr} onValueChange={setClientReferenceStr}>
          <SelectTrigger id="clientReference">
            <SelectValue placeholder="Select a client (optional)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">No client assigned</SelectItem>
            {approvedClients.map((approval) => (
              <ClientOption
                key={approval.principal.toString()}
                principalStr={approval.principal.toString()}
              />
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Additional notes..."
          rows={2}
        />
      </div>

      <Button type="submit" disabled={createFollowUp.isPending} className="w-full">
        {createFollowUp.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating...
          </>
        ) : (
          'Create Follow-Up'
        )}
      </Button>
    </form>
  );
}
