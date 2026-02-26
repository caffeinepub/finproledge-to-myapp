import React, { useState } from 'react';
import { useGetAllToDos } from '../hooks/useComplianceAdmin';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { ToDoItem, ToDoPriority, ToDoStatus } from '../backend';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Download, Plus, ClipboardList } from 'lucide-react';
import DownloadOptionsMenu, { DownloadFile } from './DownloadOptionsMenu';
import { ToDoStatusSelect } from './TaskStatusSelect';
import CreateToDoForm from './CreateToDoForm';

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function PriorityBadge({ priority }: { priority: ToDoPriority }) {
  const map: Record<string, { label: string; className: string }> = {
    high: { label: 'High', className: 'bg-red-100 text-red-800' },
    medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-800' },
    low: { label: 'Low', className: 'bg-green-100 text-green-800' },
  };
  const key = priority as unknown as string;
  const info = map[key] ?? { label: key, className: 'bg-gray-100 text-gray-800' };
  return <Badge className={`text-xs border-0 ${info.className}`}>{info.label}</Badge>;
}

function StatusBadge({ status }: { status: ToDoStatus }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    inProgress: { label: 'In Progress', className: 'bg-blue-100 text-blue-800' },
    completed: { label: 'Completed', className: 'bg-green-100 text-green-800' },
  };
  const key = status as unknown as string;
  const info = map[key] ?? { label: key, className: 'bg-gray-100 text-gray-800' };
  return <Badge className={`text-xs border-0 ${info.className}`}>{info.label}</Badge>;
}

function ClientNameCell({ principal }: { principal: string }) {
  const { data: profile } = useGetUserProfileByPrincipal(principal);
  return (
    <span className="text-sm">
      {profile
        ? profile.name
        : <span className="font-mono text-xs text-muted-foreground">{principal.slice(0, 12)}…</span>}
    </span>
  );
}

export default function ComplianceAdminToDoList() {
  const { data: todos = [], isLoading } = useGetAllToDos();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  async function handleDocumentDownload(todo: ToDoItem) {
    if (!todo.document) return;
    const bytes = await todo.document.file.getBytes();
    const blob = new Blob([bytes], { type: todo.document.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = todo.document.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  // Build table rows for export
  const tableRows = todos.map(todo => ({
    ID: String(todo.id),
    Title: todo.title,
    Description: todo.description,
    Priority: todo.priority as unknown as string,
    Status: todo.status as unknown as string,
    'Created At': formatDate(todo.createdAt),
    'Assigned Client': todo.clientPrincipal ? todo.clientPrincipal.toString() : 'Unassigned',
    'Has Document': todo.document ? 'Yes' : 'No',
  }));

  // Build file list for ZIP downloads (to-do documents)
  const downloadFiles: DownloadFile[] = todos
    .filter(todo => todo.document !== undefined && todo.document !== null)
    .map(todo => ({
      name: todo.document!.fileName,
      mimeType: todo.document!.mimeType,
      getBytes: () => todo.document!.file.getBytes(),
    }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-gold" />
          <h3 className="font-semibold text-foreground">
            To-Do List ({todos.length})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <DownloadOptionsMenu
            tableData={tableRows}
            title="Compliance To-Do List"
            files={downloadFiles}
            availableFormats={['pdf', 'spreadsheet', 'document', 'csv', 'zip']}
          />
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 bg-gold text-navy hover:bg-gold/90">
                <Plus className="h-4 w-4" />
                Add To-Do
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Create To-Do Item</DialogTitle>
              </DialogHeader>
              <CreateToDoForm onSuccess={() => setAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {todos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No to-do items found.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Priority</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todos.map(todo => (
                <TableRow key={String(todo.id)} className="hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{todo.title}</p>
                      {todo.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate">
                          {todo.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {todo.clientPrincipal ? (
                      <ClientNameCell principal={todo.clientPrincipal.toString()} />
                    ) : (
                      <span className="text-xs text-muted-foreground italic">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={todo.priority} />
                  </TableCell>
                  <TableCell>
                    <ToDoStatusSelect toDoId={todo.id} currentStatus={todo.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(todo.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    {todo.document && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDocumentDownload(todo)}
                        className="gap-1 text-gold hover:text-gold hover:bg-gold/10 h-8 px-2"
                        title={`Download ${todo.document.fileName}`}
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span className="text-xs shrink-0">Doc</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
