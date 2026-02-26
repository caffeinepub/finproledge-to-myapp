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
import { useCreateToDo } from '../hooks/useComplianceAdmin';
import { useListApprovals } from '../hooks/useApprovals';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { ToDoPriority, ToDoStatus, ToDoDocument } from '../backend';
import { Principal } from '@dfinity/principal';
import { ExternalBlob } from '../backend';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

interface CreateToDoFormProps {
  onSuccess?: () => void;
}

// Helper sub-component to resolve a principal to a display name
function ClientOption({ principalStr }: { principalStr: string }) {
  const { data: profile } = useGetUserProfileByPrincipal(principalStr);
  if (profile) {
    return <span>{profile.name} {profile.company ? `(${profile.company})` : ''}</span>;
  }
  return <span>{principalStr.slice(0, 12)}…</span>;
}

export default function CreateToDoForm({ onSuccess }: CreateToDoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ToDoPriority>(ToDoPriority.medium);
  const [status, setStatus] = useState<ToDoStatus>(ToDoStatus.pending);
  const [selectedClient, setSelectedClient] = useState<string>('none');
  const [docFile, setDocFile] = useState<File | null>(null);

  const createToDo = useCreateToDo();
  const { data: approvals } = useListApprovals();

  const approvedUsers = (approvals ?? []).filter(
    (a) => a.status === 'approved'
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    let document: ToDoDocument | null = null;
    if (docFile) {
      try {
        const arrayBuffer = await docFile.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;
        const blob = ExternalBlob.fromBytes(bytes);
        document = {
          fileName: docFile.name,
          mimeType: docFile.type || 'application/octet-stream',
          file: blob,
        };
      } catch (err) {
        toast.error('Failed to read document file');
        return;
      }
    }

    const assignedClient: Principal | null =
      selectedClient && selectedClient !== 'none'
        ? Principal.fromText(selectedClient)
        : null;

    createToDo.mutate(
      { title, description, priority, status, assignedClient, document },
      {
        onSuccess: () => {
          toast.success('To-Do created successfully');
          setTitle('');
          setDescription('');
          setPriority(ToDoPriority.medium);
          setStatus(ToDoStatus.pending);
          setSelectedClient('none');
          setDocFile(null);
          onSuccess?.();
        },
        onError: (err) => {
          const msg = err instanceof Error ? err.message : 'Something went wrong';
          toast.error(`Failed to create To-Do: ${msg}`);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="todo-title">Title *</Label>
        <Input
          id="todo-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter to-do title"
          required
        />
      </div>

      <div>
        <Label htmlFor="todo-description">Description</Label>
        <Textarea
          id="todo-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          rows={3}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="todo-priority">Priority</Label>
          <Select
            value={priority}
            onValueChange={(v) => setPriority(v as ToDoPriority)}
          >
            <SelectTrigger id="todo-priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ToDoPriority.low}>Low</SelectItem>
              <SelectItem value={ToDoPriority.medium}>Medium</SelectItem>
              <SelectItem value={ToDoPriority.high}>High</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="todo-status">Status</Label>
          <Select
            value={status}
            onValueChange={(v) => setStatus(v as ToDoStatus)}
          >
            <SelectTrigger id="todo-status">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ToDoStatus.pending}>Pending</SelectItem>
              <SelectItem value={ToDoStatus.inProgress}>In Progress</SelectItem>
              <SelectItem value={ToDoStatus.completed}>Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="todo-client">Assign to Client (optional)</Label>
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger id="todo-client">
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
        <Label htmlFor="todo-doc">Attach Document (optional)</Label>
        <Input
          id="todo-doc"
          type="file"
          onChange={(e) => setDocFile(e.target.files?.[0] ?? null)}
        />
      </div>

      <Button type="submit" disabled={createToDo.isPending} className="w-full">
        {createToDo.isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating…
          </>
        ) : (
          'Create To-Do'
        )}
      </Button>
    </form>
  );
}
