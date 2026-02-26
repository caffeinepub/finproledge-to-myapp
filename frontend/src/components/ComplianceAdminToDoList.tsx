import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { useGetAllToDos } from '../hooks/useComplianceAdmin';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { ToDoItem, ToDoPriority, ToDoStatus } from '../backend';
import { ToDoStatusSelect } from './TaskStatusSelect';
import { Download } from 'lucide-react';
import DownloadOptionsMenu, { DownloadFile } from './DownloadOptionsMenu';

function PriorityBadge({ priority }: { priority: ToDoPriority }) {
  const map: Record<string, string> = {
    [ToDoPriority.high]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    [ToDoPriority.medium]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    [ToDoPriority.low]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };
  const label =
    priority === ToDoPriority.high ? 'High' : priority === ToDoPriority.medium ? 'Medium' : 'Low';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[priority] ?? ''}`}>
      {label}
    </span>
  );
}

function ClientCell({ principalStr }: { principalStr: string }) {
  const { data: profile, isLoading } = useGetUserProfileByPrincipal(principalStr);

  if (isLoading) {
    return (
      <div className="space-y-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    );
  }

  return (
    <div className="space-y-0.5 text-xs">
      {profile ? (
        <>
          <div className="font-medium text-foreground">{profile.name}</div>
          {profile.company && (
            <div className="text-muted-foreground">{profile.company}</div>
          )}
          <div className="text-muted-foreground font-mono text-[10px]">{principalStr.slice(0, 16)}…</div>
        </>
      ) : (
        <div className="font-mono text-muted-foreground">{principalStr.slice(0, 16)}…</div>
      )}
    </div>
  );
}

export default function ComplianceAdminToDoList() {
  const { data: todos, isLoading } = useGetAllToDos();

  // Build DownloadFile[] with the correct shape: { name, mimeType, getBytes }
  const docFiles: DownloadFile[] = (todos ?? [])
    .filter((t) => !!t.document)
    .map((t) => ({
      name: t.document!.fileName,
      mimeType: t.document!.mimeType,
      getBytes: () => t.document!.file.getBytes(),
    }));

  const tableData = (todos ?? []).map((t) => ({
    id: String(t.id),
    title: t.title,
    description: t.description,
    priority: String(t.priority),
    status: String(t.status),
    client: t.clientPrincipal?.toString() ?? 'N/A',
    createdAt: new Date(Number(t.createdAt) / 1_000_000).toLocaleDateString(),
  }));

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">All To-Dos ({todos?.length ?? 0})</h3>
        <DownloadOptionsMenu
          tableData={tableData}
          title="To-Do List"
          files={docFiles}
        />
      </div>

      {!todos || todos.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4 text-center">No to-do items found.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Document</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todos.map((todo: ToDoItem) => (
                <TableRow key={String(todo.id)}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{todo.title}</div>
                      {todo.description && (
                        <div className="text-xs text-muted-foreground mt-0.5">{todo.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {todo.clientPrincipal ? (
                      <ClientCell principalStr={todo.clientPrincipal.toString()} />
                    ) : (
                      <span className="text-muted-foreground text-xs">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={todo.priority} />
                  </TableCell>
                  <TableCell>
                    <ToDoStatusSelect toDoId={todo.id} currentStatus={todo.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {new Date(Number(todo.createdAt) / 1_000_000).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {todo.document ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={async () => {
                          const bytes = await todo.document!.file.getBytes();
                          const blob = new Blob([bytes], { type: todo.document!.mimeType });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = todo.document!.fileName;
                          a.click();
                          URL.revokeObjectURL(url);
                        }}
                      >
                        <Download className="h-4 w-4 mr-1" />
                        {todo.document.fileName}
                      </Button>
                    ) : (
                      <span className="text-muted-foreground text-xs">—</span>
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
