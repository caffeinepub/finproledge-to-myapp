import { useState, useRef } from 'react';
import { ToDoPriority, ToDoStatus, ExternalBlob, ToDoDocument } from '../backend';
import { useCreateClientToDo } from '../hooks/useComplianceAdmin';
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
import { Loader2, Upload, X } from 'lucide-react';

interface ClientCreateToDoFormProps {
  onSuccess?: () => void;
}

export default function ClientCreateToDoForm({ onSuccess }: ClientCreateToDoFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<ToDoPriority>(ToDoPriority.medium);
  const [status, setStatus] = useState<ToDoStatus>(ToDoStatus.pending);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const createClientToDo = useCreateClientToDo();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error('Title is required');
      return;
    }

    try {
      let document: ToDoDocument | null = null;
      if (selectedFile) {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const uint8Array = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;
        const blob = ExternalBlob.fromBytes(uint8Array);
        document = {
          file: blob,
          fileName: selectedFile.name,
          mimeType: selectedFile.type || 'application/octet-stream',
        };
      }

      await createClientToDo.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        priority,
        status,
        document,
      });

      toast.success('To-Do created successfully!');
      setTitle('');
      setDescription('');
      setPriority(ToDoPriority.medium);
      setStatus(ToDoStatus.pending);
      setSelectedFile(null);
      onSuccess?.();
    } catch (err) {
      toast.error('Failed to create To-Do. Please try again.');
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
          placeholder="Enter To-Do title"
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
          <Label htmlFor="priority">Priority</Label>
          <Select value={priority} onValueChange={(v) => setPriority(v as ToDoPriority)}>
            <SelectTrigger id="priority">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={ToDoPriority.high}>High</SelectItem>
              <SelectItem value={ToDoPriority.medium}>Medium</SelectItem>
              <SelectItem value={ToDoPriority.low}>Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as ToDoStatus)}>
            <SelectTrigger id="status">
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

      {/* Document Upload */}
      <div className="space-y-2">
        <Label>Attach Document (optional)</Label>
        {selectedFile ? (
          <div className="flex items-center gap-2 p-3 bg-muted rounded-sm border border-border">
            <Upload className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-foreground flex-1 truncate">{selectedFile.name}</span>
            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div
            className="border-2 border-dashed border-border rounded-sm p-4 text-center cursor-pointer hover:border-primary/50 hover:bg-muted/30 transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Click to attach a document</p>
          </div>
        )}
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) setSelectedFile(file);
          }}
        />
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
          {createClientToDo.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Creating...
            </>
          ) : (
            'Create To-Do'
          )}
        </Button>
      </div>
    </form>
  );
}
