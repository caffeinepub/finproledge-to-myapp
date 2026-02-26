import { useState } from 'react';
import { ToDoItem, ToDoStatus, ToDoPriority } from '../backend';
import { useGetAllToDos } from '../hooks/useComplianceAdmin';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { ToDoStatusSelect } from './TaskStatusSelect';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Download, FileText, User } from 'lucide-react';
import { toast } from 'sonner';

const PRIORITY_COLORS: Record<string, string> = {
  high: 'bg-red-100 text-red-800',
  medium: 'bg-yellow-100 text-yellow-800',
  low: 'bg-green-100 text-green-800',
};

function ClientNameCell({ principalStr }: { principalStr: string | undefined }) {
  const { data: profile, isLoading } = useGetUserProfileByPrincipal(principalStr ?? null);

  if (!principalStr) return <span className="text-muted-foreground text-sm">—</span>;
  if (isLoading) return <Skeleton className="h-4 w-24" />;
  if (!profile) return <span className="text-muted-foreground text-xs">{principalStr.slice(0, 12)}…</span>;

  return (
    <div className="flex items-center gap-2">
      <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <div>
        <div className="font-medium text-sm text-foreground">{profile.name}</div>
        <div className="text-xs text-muted-foreground">{profile.email}</div>
        {profile.company && <div className="text-xs text-muted-foreground">{profile.company}</div>}
      </div>
    </div>
  );
}

async function downloadToDoDocument(doc: { file: any; fileName: string; mimeType: string }) {
  try {
    const bytes = await doc.file.getBytes();
    const blob = new Blob([bytes], { type: doc.mimeType || 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch {
    toast.error('Failed to download document.');
  }
}

export default function ComplianceAdminToDoList() {
  const { data: todos, isLoading, error } = useGetAllToDos();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load To-Do items. Please try again.
      </div>
    );
  }

  if (!todos || todos.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No To-Do items yet</p>
        <p className="text-sm mt-1">Create a new To-Do to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Assigned Client</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Document</TableHead>
            <TableHead>Created</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {todos.map((todo) => (
            <TableRow key={todo.id.toString()}>
              <TableCell>
                <div>
                  <div className="font-medium text-foreground">{todo.title}</div>
                  {todo.description && (
                    <div className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate">
                      {todo.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <ClientNameCell
                  principalStr={
                    todo.assignedClient?.toString() ?? todo.clientPrincipal?.toString()
                  }
                />
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    PRIORITY_COLORS[todo.priority] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                </span>
              </TableCell>
              <TableCell>
                <ToDoStatusSelect toDoId={todo.id} currentStatus={todo.status} />
              </TableCell>
              <TableCell>
                {todo.document ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => downloadToDoDocument(todo.document!)}
                    className="gap-1"
                  >
                    <Download className="w-3.5 h-3.5" />
                    {todo.document.fileName}
                  </Button>
                ) : (
                  <span className="text-muted-foreground text-sm">—</span>
                )}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(Number(todo.createdAt) / 1_000_000).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
