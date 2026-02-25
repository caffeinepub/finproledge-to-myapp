import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckSquare,
  Calendar,
  Bell,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Circle,
  ClipboardList,
} from 'lucide-react';
import {
  useGetMyToDos,
  useGetMyTimelines,
  useGetMyFollowUps,
  useGetMyDeadlines,
} from '../hooks/useComplianceAdmin';
import {
  ToDoItem, ToDoStatus,
  TimelineEntry, TimelineStatus,
  FollowUpItem, FollowUpStatus,
  DeadlineRecord, DeadlineStatus, UrgencyLevel,
} from '../backend';
import ClientCreateToDoForm from './ClientCreateToDoForm';
import ClientCreateTimelineForm from './ClientCreateTimelineForm';
import ClientCreateFollowUpForm from './ClientCreateFollowUpForm';
import ClientCreateDeadlineForm from './ClientCreateDeadlineForm';
import {
  ToDoStatusSelect,
  TimelineStatusSelect,
  FollowUpStatusSelect,
  DeadlineStatusSelect,
} from './TaskStatusSelect';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function PriorityBadge({ priority }: { priority: string }) {
  switch (priority) {
    case 'high':
      return <Badge variant="destructive">High</Badge>;
    case 'medium':
      return <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">Medium</Badge>;
    case 'low':
      return <Badge variant="secondary">Low</Badge>;
    default:
      return <Badge variant="outline">{priority}</Badge>;
  }
}

function UrgencyBadge({ level }: { level: UrgencyLevel }) {
  switch (level) {
    case UrgencyLevel.high:
      return <Badge variant="destructive"><AlertTriangle className="h-3 w-3 mr-1" />High</Badge>;
    case UrgencyLevel.medium:
      return <Badge variant="default" className="bg-amber-500 hover:bg-amber-600">Medium</Badge>;
    case UrgencyLevel.low:
      return <Badge variant="secondary">Low</Badge>;
    default:
      return <Badge variant="outline">{String(level)}</Badge>;
  }
}

function LoadingRows({ cols }: { cols: number }) {
  return (
    <>
      {[1, 2, 3].map(i => (
        <TableRow key={i}>
          {Array.from({ length: cols }).map((_, j) => (
            <TableCell key={j}>
              <Skeleton className="h-4 w-full" />
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function EmptyState({ icon: Icon, message }: { icon: React.ElementType; message: string }) {
  return (
    <div className="text-center py-10 text-muted-foreground">
      <Icon className="h-10 w-10 mx-auto mb-3 opacity-30" />
      <p className="text-sm">{message}</p>
    </div>
  );
}

// ─── To-Do Sub-Section ────────────────────────────────────────────────────────

function MyToDoSection() {
  const { data: todos, isLoading } = useGetMyToDos();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2">
            <CheckSquare className="h-4 w-4 text-primary" />
            To-Do List
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Your personal to-do items. Change status as you progress.</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-1" />
          Add To-Do
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Change Status</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingRows cols={5} />
            ) : !todos || todos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState icon={CheckSquare} message="No to-do items yet. Click 'Add To-Do' to create one." />
                </TableCell>
              </TableRow>
            ) : (
              todos.map((todo: ToDoItem) => (
                <TableRow key={todo.id.toString()}>
                  <TableCell className="font-medium">{todo.title}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[180px] truncate hidden md:table-cell">
                    {todo.description || '—'}
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={todo.priority as unknown as string} />
                  </TableCell>
                  <TableCell>
                    <ToDoStatusSelect taskId={todo.id} currentStatus={todo.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm hidden sm:table-cell">
                    {formatDate(todo.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add To-Do</DialogTitle>
            <DialogDescription>Create a new to-do item for yourself.</DialogDescription>
          </DialogHeader>
          <ClientCreateToDoForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Timeline Sub-Section ─────────────────────────────────────────────────────

function MyTimelineSection() {
  const { data: timelines, isLoading } = useGetMyTimelines();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            Timelines
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Your timeline entries. Update status as milestones are reached.</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-1" />
          Add Entry
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="hidden sm:table-cell">Start</TableHead>
              <TableHead className="hidden sm:table-cell">End</TableHead>
              <TableHead>Change Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingRows cols={5} />
            ) : !timelines || timelines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState icon={Calendar} message="No timeline entries yet. Click 'Add Entry' to create one." />
                </TableCell>
              </TableRow>
            ) : (
              timelines.map((entry: TimelineEntry) => (
                <TableRow key={entry.id.toString()}>
                  <TableCell className="font-medium">{entry.title}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[180px] truncate hidden md:table-cell">
                    {entry.description || '—'}
                  </TableCell>
                  <TableCell className="text-sm hidden sm:table-cell">{formatDate(entry.startDate)}</TableCell>
                  <TableCell className="text-sm hidden sm:table-cell">{formatDate(entry.endDate)}</TableCell>
                  <TableCell>
                    <TimelineStatusSelect taskId={entry.id} currentStatus={entry.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Timeline Entry</DialogTitle>
            <DialogDescription>Create a new timeline entry for yourself.</DialogDescription>
          </DialogHeader>
          <ClientCreateTimelineForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Follow-Up Sub-Section ────────────────────────────────────────────────────

function MyFollowUpSection() {
  const { data: followUps, isLoading } = useGetMyFollowUps();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Follow-Ups
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Your follow-up items. Mark as completed when done.</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-1" />
          Add Follow-Up
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="hidden sm:table-cell">Due Date</TableHead>
              <TableHead>Change Status</TableHead>
              <TableHead className="hidden lg:table-cell">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingRows cols={5} />
            ) : !followUps || followUps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState icon={Bell} message="No follow-up items yet. Click 'Add Follow-Up' to create one." />
                </TableCell>
              </TableRow>
            ) : (
              followUps.map((item: FollowUpItem) => (
                <TableRow key={item.id.toString()}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[180px] truncate hidden md:table-cell">
                    {item.description || '—'}
                  </TableCell>
                  <TableCell className="text-sm hidden sm:table-cell">{formatDate(item.dueDate)}</TableCell>
                  <TableCell>
                    <FollowUpStatusSelect taskId={item.id} currentStatus={item.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-[160px] truncate text-sm hidden lg:table-cell">
                    {item.notes || '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Follow-Up</DialogTitle>
            <DialogDescription>Create a new follow-up item for yourself.</DialogDescription>
          </DialogHeader>
          <ClientCreateFollowUpForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Deadline Sub-Section ─────────────────────────────────────────────────────

function MyDeadlineSection() {
  const { data: deadlines, isLoading } = useGetMyDeadlines();
  const [open, setOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            Deadlines
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">Your deadlines. Update status to reflect current progress.</p>
        </div>
        <Button size="sm" onClick={() => setOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-1" />
          Add Deadline
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead className="hidden md:table-cell">Description</TableHead>
              <TableHead className="hidden sm:table-cell">Due Date</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Change Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingRows cols={5} />
            ) : !deadlines || deadlines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState icon={Clock} message="No deadlines yet. Click 'Add Deadline' to create one." />
                </TableCell>
              </TableRow>
            ) : (
              deadlines.map((record: DeadlineRecord) => (
                <TableRow key={record.id.toString()}>
                  <TableCell className="font-medium">{record.title}</TableCell>
                  <TableCell className="text-muted-foreground max-w-[180px] truncate hidden md:table-cell">
                    {record.description || '—'}
                  </TableCell>
                  <TableCell className="text-sm hidden sm:table-cell">{formatDate(record.dueDate)}</TableCell>
                  <TableCell>
                    <UrgencyBadge level={record.urgencyLevel} />
                  </TableCell>
                  <TableCell>
                    <DeadlineStatusSelect taskId={record.id} currentStatus={record.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Deadline</DialogTitle>
            <DialogDescription>Create a new deadline for yourself.</DialogDescription>
          </DialogHeader>
          <ClientCreateDeadlineForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ─── Summary Stats ────────────────────────────────────────────────────────────

function TaskSummaryStats() {
  const { data: todos } = useGetMyToDos();
  const { data: timelines } = useGetMyTimelines();
  const { data: followUps } = useGetMyFollowUps();
  const { data: deadlines } = useGetMyDeadlines();

  const totalTasks =
    (todos?.length ?? 0) +
    (timelines?.length ?? 0) +
    (followUps?.length ?? 0) +
    (deadlines?.length ?? 0);

  const completedTasks =
    (todos?.filter(t => t.status === ToDoStatus.completed).length ?? 0) +
    (timelines?.filter(t => t.status === TimelineStatus.completed).length ?? 0) +
    (followUps?.filter(f => f.status === FollowUpStatus.completed).length ?? 0) +
    (deadlines?.filter(d => d.status === DeadlineStatus.completed).length ?? 0);

  const pendingTasks =
    (todos?.filter(t => t.status === ToDoStatus.pending).length ?? 0) +
    (followUps?.filter(f => f.status === FollowUpStatus.pending).length ?? 0) +
    (deadlines?.filter(d => d.status === DeadlineStatus.active).length ?? 0);

  const inProgressTasks =
    (todos?.filter(t => t.status === ToDoStatus.inProgress).length ?? 0) +
    (timelines?.filter(t => t.status === TimelineStatus.inProgress).length ?? 0);

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      <div className="rounded-lg border bg-card p-3 text-center">
        <div className="text-2xl font-bold text-foreground">{totalTasks}</div>
        <div className="text-xs text-muted-foreground mt-0.5">Total Tasks</div>
      </div>
      <div className="rounded-lg border bg-card p-3 text-center">
        <div className="text-2xl font-bold text-amber-600">{pendingTasks}</div>
        <div className="text-xs text-muted-foreground mt-0.5">Pending</div>
      </div>
      <div className="rounded-lg border bg-card p-3 text-center">
        <div className="text-2xl font-bold text-blue-600">{inProgressTasks}</div>
        <div className="text-xs text-muted-foreground mt-0.5">In Progress</div>
      </div>
      <div className="rounded-lg border bg-card p-3 text-center">
        <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
        <div className="text-xs text-muted-foreground mt-0.5">Completed</div>
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MyComplianceTasksSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ClipboardList className="h-5 w-5 text-primary" />
          My Compliance Tasks
        </CardTitle>
        <CardDescription>
          Manage your To-Dos, Timelines, Follow-Ups, and Deadlines. Add new items and update their status as you progress.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <TaskSummaryStats />

        <Tabs defaultValue="todos">
          <TabsList className="mb-6 flex flex-wrap h-auto gap-1">
            <TabsTrigger value="todos" className="flex items-center gap-1.5">
              <CheckSquare className="h-3.5 w-3.5" />
              To-Dos
            </TabsTrigger>
            <TabsTrigger value="timelines" className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" />
              Timelines
            </TabsTrigger>
            <TabsTrigger value="followups" className="flex items-center gap-1.5">
              <Bell className="h-3.5 w-3.5" />
              Follow-Ups
            </TabsTrigger>
            <TabsTrigger value="deadlines" className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Deadlines
            </TabsTrigger>
          </TabsList>

          <TabsContent value="todos">
            <MyToDoSection />
          </TabsContent>
          <TabsContent value="timelines">
            <MyTimelineSection />
          </TabsContent>
          <TabsContent value="followups">
            <MyFollowUpSection />
          </TabsContent>
          <TabsContent value="deadlines">
            <MyDeadlineSection />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
