import { useState } from 'react';
import { TimelineStatus } from '../backend';
import { useCreateTimeline } from '../hooks/useComplianceAdmin';
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

interface CreateTimelineFormProps {
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

export default function CreateTimelineForm({ onSuccess }: CreateTimelineFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [status, setStatus] = useState<TimelineStatus>(TimelineStatus.planned);
  const [clientPrincipalStr, setClientPrincipalStr] = useState<string>('');

  const createTimeline = useCreateTimeline();
  const { data: approvals } = useListApprovals();

  const approvedClients = approvals?.filter(
    (a) => a.status === ApprovalStatus.approved
  ) ?? [];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !startDate || !endDate) {
      toast.error('Title, start date, and end date are required');
      return;
    }

    try {
      const startNs = BigInt(new Date(startDate).getTime()) * BigInt(1_000_000);
      const endNs = BigInt(new Date(endDate).getTime()) * BigInt(1_000_000);

      const { Principal } = await import('@dfinity/principal');
      const principal = clientPrincipalStr ? Principal.fromText(clientPrincipalStr) : null;

      await createTimeline.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        startDate: startNs,
        endDate: endNs,
        status,
        taskReference: null,
        clientPrincipal: principal,
      });

      toast.success('Timeline entry created successfully!');
      setTitle('');
      setDescription('');
      setStartDate('');
      setEndDate('');
      setStatus(TimelineStatus.planned);
      setClientPrincipalStr('');
      onSuccess?.();
    } catch (err) {
      toast.error('Failed to create Timeline entry. Please try again.');
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
          placeholder="Enter timeline title"
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
          <Label htmlFor="startDate">
            Start Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">
            End Date <span className="text-destructive">*</span>
          </Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <Select value={status} onValueChange={(v) => setStatus(v as TimelineStatus)}>
          <SelectTrigger id="status">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={TimelineStatus.planned}>Planned</SelectItem>
            <SelectItem value={TimelineStatus.inProgress}>In Progress</SelectItem>
            <SelectItem value={TimelineStatus.completed}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="clientPrincipal">Assign to Client</Label>
        <Select value={clientPrincipalStr} onValueChange={setClientPrincipalStr}>
          <SelectTrigger id="clientPrincipal">
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

      <Button type="submit" disabled={createTimeline.isPending} className="w-full">
        {createTimeline.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Creating...
          </>
        ) : (
          'Create Timeline Entry'
        )}
      </Button>
    </form>
  );
}
