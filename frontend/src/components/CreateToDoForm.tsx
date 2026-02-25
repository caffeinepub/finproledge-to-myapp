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
import { useCreateToDo, ToDoPriority } from '../hooks/useComplianceAdmin';
import { ToDoStatus } from '../backend';
import { Principal } from '@icp-sdk/core/principal';

interface CreateToDoFormProps {
  onSuccess: () => void;
}

export default function CreateToDoForm({ onSuccess }: CreateToDoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ToDoPriority>('medium');
  const [status, setStatus] = useState<ToDoStatus>(ToDoStatus.pending);
  const [assignedClient, setAssignedClient] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const createToDo = useCreateToDo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    let clientPrincipal: Principal | null = null;
    if (assignedClient.trim()) {
      try {
        clientPrincipal = Principal.fromText(assignedClient.trim());
      } catch {
        setError('Invalid client principal ID format.');
        return;
      }
    }

    try {
      await createToDo.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        assignedClient: clientPrincipal,
      });
      setSuccess(true);
      setTimeout(() => {
        onSuccess();
      }, 800);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create To-Do item.';
      setError(msg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {success && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            To-Do item created successfully!
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
        <Label htmlFor="todo-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="todo-title"
          placeholder="e.g. Prepare Q4 tax filing"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={createToDo.isPending || success}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="todo-description">Description</Label>
        <Textarea
          id="todo-description"
          placeholder="Optional details about this task..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          disabled={createToDo.isPending || success}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="todo-priority">Priority</Label>
          <Select
            value={priority}
            onValueChange={v => setPriority(v as ToDoPriority)}
            disabled={createToDo.isPending || success}
          >
            <SelectTrigger id="todo-priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="todo-status">Status</Label>
          <Select
            value={status}
            onValueChange={v => setStatus(v as ToDoStatus)}
            disabled={createToDo.isPending || success}
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

      <div className="space-y-1.5">
        <Label htmlFor="todo-client">Assigned Client Principal (optional)</Label>
        <Input
          id="todo-client"
          placeholder="e.g. aaaaa-aa (Principal ID)"
          value={assignedClient}
          onChange={e => setAssignedClient(e.target.value)}
          disabled={createToDo.isPending || success}
          className="font-mono text-sm"
        />
        <p className="text-xs text-muted-foreground">Leave blank if not assigned to a specific client.</p>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={createToDo.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createToDo.isPending || success}>
          {createToDo.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {createToDo.isPending ? 'Creating...' : 'Create To-Do'}
        </Button>
      </div>
    </form>
  );
}
