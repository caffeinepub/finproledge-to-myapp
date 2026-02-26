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
import { useCreateTimelineEntry } from '../hooks/useComplianceAdmin';
import { useListApprovals } from '../hooks/useApprovals';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { TimelineStatus } from '../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreateTimelineFormProps {
  onSuccess?: () => void;
}

function ClientOption({ principalStr }: { principalStr: string }) {
  const { data: profile } = useGetUserProfileByPrincipal(principalStr);
  if (profile) {
    return <span>{profile.name} {profile.company ? `(${profile.company})` : ''}</span>;
  }
  return <span>{principalStr.slice(0, 12)}…</span>;
}

export default function CreateTimelineForm({ onSuccess }: CreateTimelineFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<TimelineStatus>(TimelineStatus.planned);
  const [selectedClient, setSelectedClient] = useState<string>('none');

  const createTimeline = useCreateTimelineEntry();
  const { data: approvals } = useListApprovals();

  const approvedUsers = (approvals ?? []).filter((a) => a.status === 'approved');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!startDate || !endDate) {
      toast.error('Start date and end date are required');
      return;
    }

    const startMs = new Date(startDate).getTime();
    const endMs = new Date(endDate).getTime();
    if (isNaN(startMs) || isNaN(endMs)) {
      toast.error('Invalid date values');
      return;
    }

    const startDateNs = BigInt(startMs) * BigInt(1_000_000);
    const endDateNs = BigInt(endMs) * BigInt(1_000_000);

    const clientPrincipal: Principal | null =
      selectedClient && selectedClient !== 'none'
        ? Principal.fromText(selectedClient)
        : null;

    createTimeline.mutate(
      {
        title,
        description,
        startDate: startDateNs,
        endDate: endDateNs,
        status,
        taskReference: null,
        clientPrincipal,
      },
      {
        onSuccess: () => {
          toast.success('Timeline entry created successfully');
          setTitle('');
          setDescription('');
          setStartDate('');
          setEndDate('');
          setStatus(TimelineStatus.planned);
          setSelectedClient('none');
          onSuccess?.();
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : 'Something went wrong';
          toast.error(`Failed to create timeline: ${msg}`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="timeline-title">Title *</Label>
        <Input
          id="timeline-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter timeline title"
          required
        />
      </div>

      <div>
        <Label htmlFor="timeline-description">Description</Label>
        <Textarea
          id="timeline-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="timeline-start">Start Date *</Label>
          <Input
            id="timeline-start"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div>
          <Label htmlFor="timeline-end">End Date *</Label>
          <Input
            id="timeline-end"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div>
        <Label htmlFor="timeline-status">Status</Label>
        <Select value={status} onValueChange={(v) => setStatus(v as TimelineStatus)}>
          <SelectTrigger id="timeline-status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TimelineStatus.planned}>Planned</SelectItem>
            <SelectItem value={TimelineStatus.inProgress}>In Progress</SelectItem>
            <SelectItem value={TimelineStatus.completed}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="timeline-client">Assign to Client (optional)</Label>
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger id="timeline-client">
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

      <Button type="submit" disabled={createTimeline.isPending} className="w-full">
        {createTimeline.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating…
          </>
        ) : (
          'Create Timeline Entry'
        )}
      </Button>
    </form>
  );
}
