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
import { useCreateClientToDo, ToDoPriority } from '../hooks/useComplianceAdmin';
import { ToDoStatus } from '../backend';
import { toast } from 'sonner';

interface ClientCreateToDoFormProps {
  onSuccess: () => void;
}

export default function ClientCreateToDoForm({ onSuccess }: ClientCreateToDoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ToDoPriority>(ToDoPriority.medium);
  const [status, setStatus] = useState<ToDoStatus>(ToDoStatus.pending);
  const [error, setError] = useState('');

  const createClientToDo = useCreateClientToDo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError('Title is required.');
      return;
    }

    try {
      await createClientToDo.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
      });
      toast.success('To-Do item created successfully!');
      onSuccess();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to create To-Do item.';
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
        <Label htmlFor="ctodo-title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="ctodo-title"
          placeholder="e.g. Gather Q4 receipts"
          value={title}
          onChange={e => setTitle(e.target.value)}
          disabled={createClientToDo.isPending}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="ctodo-description">Description</Label>
        <Textarea
          id="ctodo-description"
          placeholder="Optional details about this task..."
          value={description}
          onChange={e => setDescription(e.target.value)}
          rows={3}
          disabled={createClientToDo.isPending}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="ctodo-priority">Priority</Label>
          <Select
            value={priority}
            onValueChange={v => setPriority(v as ToDoPriority)}
            disabled={createClientToDo.isPending}
          >
            <SelectTrigger id="ctodo-priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ToDoPriority.high}>High</SelectItem>
              <SelectItem value={ToDoPriority.medium}>Medium</SelectItem>
              <SelectItem value={ToDoPriority.low}>Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="ctodo-status">Status</Label>
          <Select
            value={status}
            onValueChange={v => setStatus(v as ToDoStatus)}
            disabled={createClientToDo.isPending}
          >
            <SelectTrigger id="ctodo-status">
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

      <div className="flex justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onSuccess}
          disabled={createClientToDo.isPending}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={createClientToDo.isPending}>
          {createClientToDo.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {createClientToDo.isPending ? 'Creating...' : 'Create To-Do'}
        </Button>
      </div>
    </form>
  );
}
