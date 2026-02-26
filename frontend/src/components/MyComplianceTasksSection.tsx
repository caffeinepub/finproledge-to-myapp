import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetMyToDos, useGetMyTimelines, useGetMyFollowUps } from '../hooks/useComplianceAdmin';
import { ToDoStatusSelect, TimelineStatusSelect, FollowUpStatusSelect } from './TaskStatusSelect';
import ClientCreateToDoForm from './ClientCreateToDoForm';
import ClientCreateTimelineForm from './ClientCreateTimelineForm';
import ClientCreateFollowUpForm from './ClientCreateFollowUpForm';
import {
  ToDoItem,
  TimelineEntry,
  FollowUpItem,
  ToDoStatus,
  TimelineStatus,
  FollowUpStatus,
  ToDoPriority,
} from '../backend';

function PriorityBadge({ priority }: { priority: unknown }) {
  const map: Record<string, { label: string; className: string }> = {
    [ToDoPriority.high]: { label: 'High', className: 'bg-red-100 text-red-700 border-red-200' },
    [ToDoPriority.medium]: { label: 'Medium', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    [ToDoPriority.low]: { label: 'Low', className: 'bg-green-100 text-green-700 border-green-200' },
  };
  const config = map[priority as string] ?? { label: String(priority), className: '' };
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString();
}

export default function MyComplianceTasksSection() {
  const { data: todos, isLoading: todosLoading } = useGetMyToDos();
  const { data: timelines, isLoading: timelinesLoading } = useGetMyTimelines();
  const { data: followUps, isLoading: followUpsLoading } = useGetMyFollowUps();

  const [todoDialogOpen, setTodoDialogOpen] = useState(false);
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);

  const totalTodos = todos?.length ?? 0;
  const totalTimelines = timelines?.length ?? 0;
  const totalFollowUps = followUps?.length ?? 0;

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-sm p-4 text-center">
          <div className="text-2xl font-bold text-navy">{totalTodos}</div>
          <div className="text-sm text-muted-foreground">To-Dos</div>
        </div>
        <div className="bg-card border border-border rounded-sm p-4 text-center">
          <div className="text-2xl font-bold text-navy">{totalTimelines}</div>
          <div className="text-sm text-muted-foreground">Timelines</div>
        </div>
        <div className="bg-card border border-border rounded-sm p-4 text-center">
          <div className="text-2xl font-bold text-navy">{totalFollowUps}</div>
          <div className="text-sm text-muted-foreground">Follow-Ups</div>
        </div>
      </div>

      <Tabs defaultValue="todos">
        <TabsList>
          <TabsTrigger value="todos">To-Dos</TabsTrigger>
          <TabsTrigger value="timelines">Timelines</TabsTrigger>
          <TabsTrigger value="followups">Follow-Ups</TabsTrigger>
        </TabsList>

        {/* To-Dos */}
        <TabsContent value="todos" className="mt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground">To-Do Items</h3>
              <Dialog open={todoDialogOpen} onOpenChange={setTodoDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create To-Do</DialogTitle></DialogHeader>
                  <ClientCreateToDoForm onSuccess={() => setTodoDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
            {todosLoading ? (
              <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : !todos || todos.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">No to-dos yet.</div>
            ) : (
              <div className="border border-border rounded-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Priority</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {todos.map((todo: ToDoItem) => (
                      <TableRow key={String(todo.id)}>
                        <TableCell className="font-medium">{todo.title}</TableCell>
                        <TableCell><PriorityBadge priority={todo.priority} /></TableCell>
                        <TableCell>
                          <ToDoStatusSelect toDoId={todo.id} currentStatus={todo.status as unknown as ToDoStatus} />
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {new Date(Number(todo.createdAt) / 1_000_000).toLocaleDateString()}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Timelines */}
        <TabsContent value="timelines" className="mt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground">Timeline Entries</h3>
              <Dialog open={timelineDialogOpen} onOpenChange={setTimelineDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create Timeline Entry</DialogTitle></DialogHeader>
                  <ClientCreateTimelineForm onSuccess={() => setTimelineDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
            {timelinesLoading ? (
              <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : !timelines || timelines.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">No timelines yet.</div>
            ) : (
              <div className="border border-border rounded-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Start</TableHead>
                      <TableHead>End</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {timelines.map((entry: TimelineEntry) => (
                      <TableRow key={String(entry.id)}>
                        <TableCell className="font-medium">{entry.title}</TableCell>
                        <TableCell className="text-sm">{formatDate(entry.startDate)}</TableCell>
                        <TableCell className="text-sm">{formatDate(entry.endDate)}</TableCell>
                        <TableCell>
                          <TimelineStatusSelect timelineId={entry.id} currentStatus={entry.status as unknown as TimelineStatus} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>

        {/* Follow-Ups */}
        <TabsContent value="followups" className="mt-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-foreground">Follow-Up Items</h3>
              <Dialog open={followUpDialogOpen} onOpenChange={setFollowUpDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Plus className="w-4 h-4 mr-1" /> Add
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Create Follow-Up</DialogTitle></DialogHeader>
                  <ClientCreateFollowUpForm onSuccess={() => setFollowUpDialogOpen(false)} />
                </DialogContent>
              </Dialog>
            </div>
            {followUpsLoading ? (
              <div className="space-y-2">{[...Array(3)].map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}</div>
            ) : !followUps || followUps.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm">No follow-ups yet.</div>
            ) : (
              <div className="border border-border rounded-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Title</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Notes</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {followUps.map((item: FollowUpItem) => (
                      <TableRow key={String(item.id)}>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell className="text-sm">{formatDate(item.dueDate)}</TableCell>
                        <TableCell className="text-muted-foreground text-sm max-w-xs truncate">{item.notes || '—'}</TableCell>
                        <TableCell>
                          <FollowUpStatusSelect followUpId={item.id} currentStatus={item.status as unknown as FollowUpStatus} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
