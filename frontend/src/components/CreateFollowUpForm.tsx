import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useCreateFollowUp } from '../hooks/useComplianceAdmin';
import { useListApprovals } from '../hooks/useApprovals';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { FollowUpStatus } from '../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreateFollowUpFormProps {
  onSuccess?: () => void;
}

function ClientOption({ principalStr }: { principalStr: string }) {
  const { data: profile } = useGetUserProfileByPrincipal(principalStr);
  if (profile) {
    return <span>{profile.name} {profile.company ? `(${profile.company})` : ''}</span>;
  }
  return <span>{principalStr.slice(0, 12)}…</span>;
}

export default function CreateFollowUpForm({ onSuccess }: CreateFollowUpFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [status, setStatus] = useState<FollowUpStatus>(FollowUpStatus.pending);
  const [notes, setNotes] = useState('');
  const [selectedClient, setSelectedClient] = useState<string>('none');

  const createFollowUp = useCreateFollowUp();
  const { data: approvals } = useListApprovals();

  const approvedUsers = (approvals ?? []).filter((a) => a.status === 'approved');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!dueDate) {
      toast.error('Due date is required');
      return;
    }

    const dueDateMs = new Date(dueDate).getTime();
    if (isNaN(dueDateMs)) {
      toast.error('Invalid due date');
      return;
    }

    const dueDateNs = BigInt(dueDateMs) * BigInt(1_000_000);

    const clientReference: Principal | null =
      selectedClient && selectedClient !== 'none'
        ? Principal.fromText(selectedClient)
        : null;

    createFollowUp.mutate(
      { title, description, dueDate: dueDateNs, clientReference, status, notes },
      {
        onSuccess: () => {
          toast.success('Follow-up created successfully');
          setTitle('');
          setDescription('');
          setDueDate('');
          setStatus(FollowUpStatus.pending);
          setNotes('');
          setSelectedClient('none');
          onSuccess?.();
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : 'Something went wrong';
          toast.error(`Failed to create follow-up: ${msg}`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="followup-title">Title *</Label>
        <Input
          id="followup-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter follow-up title"
          required
        />
      </div>

      <div>
        <Label htmlFor="followup-description">Description</Label>
        <Textarea
          id="followup-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="followup-due">Due Date *</Label>
          <Input
            id="followup-due"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="followup-status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as FollowUpStatus)}>
            <SelectTrigger id="followup-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={FollowUpStatus.pending}>Pending</SelectItem>
              <SelectItem value={FollowUpStatus.completed}>Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="followup-client">Assign to Client (optional)</Label>
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger id="followup-client">
            <SelectValue placeholder="Select a client" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No client assigned</SelectItem>
            {approvedUsers.map((approval) => {
              const principalStr = approval.principal.toString();
              return (
                <SelectItem key={principalStr} value={principalStr}>
                  <ClientOption principalStr={principalStr} />
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="followup-notes">Notes</Label>
        <Textarea
          id="followup-notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Enter any notes"
          rows={2}
        />
      </div>

      <Button type="submit" disabled={createFollowUp.isPending} className="w-full">
        {createFollowUp.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating…
          </>
        ) : (
          'Create Follow-Up'
        )}
      </Button>
    </form>
  );
}
