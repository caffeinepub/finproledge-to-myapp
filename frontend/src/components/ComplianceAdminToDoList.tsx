import { useState } from 'react';
import { Plus, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllToDos, ToDoPriority } from '../hooks/useComplianceAdmin';
import { ToDoStatusSelect } from './TaskStatusSelect';
import CreateToDoForm from './CreateToDoForm';
import { ToDoItem, ToDoStatus } from '../backend';

function PriorityBadge({ priority }: { priority: unknown }) {
  const p = priority as unknown as ToDoPriority;
  const map: Record<string, { label: string; className: string }> = {
    high: { label: 'High', className: 'bg-red-100 text-red-700 border-red-200' },
    medium: { label: 'Medium', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    low: { label: 'Low', className: 'bg-green-100 text-green-700 border-green-200' },
  };
  const config = map[p as string] ?? { label: String(p), className: '' };
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

export default function ComplianceAdminToDoList() {
  const { data: todos, isLoading } = useGetAllToDos();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">To-Do List</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-navy text-white hover:bg-navy/90">
              <Plus className="w-4 h-4 mr-1" /> Add To-Do
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New To-Do</DialogTitle>
            </DialogHeader>
            <CreateToDoForm onSuccess={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : !todos || todos.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No to-do items yet. Create one to get started.
        </div>
      ) : (
        <div className="border border-border rounded-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Assigned Client</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {todos.map((todo: ToDoItem) => (
                <TableRow key={String(todo.id)}>
                  <TableCell className="font-medium">{todo.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-xs truncate">{todo.description}</TableCell>
                  <TableCell>
                    <PriorityBadge priority={todo.priority as unknown as ToDoPriority} />
                  </TableCell>
                  <TableCell>
                    <ToDoStatusSelect
                      toDoId={todo.id}
                      currentStatus={todo.status as unknown as ToDoStatus}
                    />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-xs">
                    {todo.assignedClient ? String(todo.assignedClient).slice(0, 12) + '...' : '—'}
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
