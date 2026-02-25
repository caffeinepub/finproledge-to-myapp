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
import {
  CheckSquare,
  Calendar,
  Bell,
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Circle,
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(ns: bigint): string {
  const ms = Number(ns) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function ToDoStatusBadge({ status }: { status: ToDoStatus }) {
  switch (status) {
    case ToDoStatus.pending:
      return <Badge variant="secondary">Pending</Badge>;
    case ToDoStatus.inProgress:
      return <Badge variant="default">In Progress</Badge>;
    case ToDoStatus.completed:
      return <Badge className="bg-green-600 text-white hover:bg-green-700">Completed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
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

function TimelineStatusBadge({ status }: { status: TimelineStatus }) {
  switch (status) {
    case TimelineStatus.planned:
      return <Badge variant="secondary">Planned</Badge>;
    case TimelineStatus.inProgress:
      return <Badge variant="default">In Progress</Badge>;
    case TimelineStatus.completed:
      return <Badge className="bg-green-600 text-white hover:bg-green-700">Completed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

function FollowUpStatusBadge({ status }: { status: FollowUpStatus }) {
  switch (status) {
    case FollowUpStatus.pending:
      return <Badge variant="secondary"><Circle className="h-3 w-3 mr-1" />Pending</Badge>;
    case FollowUpStatus.completed:
      return <Badge className="bg-green-600 text-white hover:bg-green-700"><CheckCircle2 className="h-3 w-3 mr-1" />Completed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
  }
}

function DeadlineStatusBadge({ status }: { status: DeadlineStatus }) {
  switch (status) {
    case DeadlineStatus.active:
      return <Badge variant="default">Active</Badge>;
    case DeadlineStatus.completed:
      return <Badge className="bg-green-600 text-white hover:bg-green-700">Completed</Badge>;
    case DeadlineStatus.missed:
      return <Badge variant="destructive">Missed</Badge>;
    default:
      return <Badge variant="outline">Unknown</Badge>;
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
      return <Badge variant="outline">{level}</Badge>;
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

// ─── Section Components ───────────────────────────────────────────────────────

function ToDoSection() {
  const { data: todos, isLoading } = useGetMyToDos();
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <CheckSquare className="h-5 w-5 text-primary" />
            To-Do List
          </CardTitle>
          <CardDescription>Tasks assigned to you or created by you.</CardDescription>
        </div>
        <Button size="sm" onClick={() => setOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-1" />
          Add To-Do
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingRows cols={5} />
            ) : !todos || todos.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState icon={CheckSquare} message="No to-do items yet. Add one to get started." />
                </TableCell>
              </TableRow>
            ) : (
              todos.map((todo: ToDoItem) => (
                <TableRow key={todo.id.toString()}>
                  <TableCell className="font-medium">{todo.title}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {todo.description || '—'}
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={todo.priority as unknown as string} />
                  </TableCell>
                  <TableCell>
                    <ToDoStatusBadge status={todo.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(todo.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add To-Do</DialogTitle>
            <DialogDescription>Create a new to-do item for yourself.</DialogDescription>
          </DialogHeader>
          <ClientCreateToDoForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function TimelineSection() {
  const { data: timelines, isLoading } = useGetMyTimelines();
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Timeline
          </CardTitle>
          <CardDescription>Timeline entries assigned to you or created by you.</CardDescription>
        </div>
        <Button size="sm" onClick={() => setOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-1" />
          Add Entry
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingRows cols={5} />
            ) : !timelines || timelines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState icon={Calendar} message="No timeline entries yet. Add one to get started." />
                </TableCell>
              </TableRow>
            ) : (
              timelines.map((entry: TimelineEntry) => (
                <TableRow key={entry.id.toString()}>
                  <TableCell className="font-medium">{entry.title}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {entry.description || '—'}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(entry.startDate)}</TableCell>
                  <TableCell className="text-sm">{formatDate(entry.endDate)}</TableCell>
                  <TableCell>
                    <TimelineStatusBadge status={entry.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Timeline Entry</DialogTitle>
            <DialogDescription>Create a new timeline entry for yourself.</DialogDescription>
          </DialogHeader>
          <ClientCreateTimelineForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function FollowUpSection() {
  const { data: followUps, isLoading } = useGetMyFollowUps();
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Bell className="h-5 w-5 text-primary" />
            Follow-Ups
          </CardTitle>
          <CardDescription>Follow-up items assigned to you or created by you.</CardDescription>
        </div>
        <Button size="sm" onClick={() => setOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-1" />
          Add Follow-Up
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingRows cols={5} />
            ) : !followUps || followUps.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState icon={Bell} message="No follow-up items yet. Add one to get started." />
                </TableCell>
              </TableRow>
            ) : (
              followUps.map((item: FollowUpItem) => (
                <TableRow key={item.id.toString()}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {item.description || '—'}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(item.dueDate)}</TableCell>
                  <TableCell>
                    <FollowUpStatusBadge status={item.status} />
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate text-sm">
                    {item.notes || '—'}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Follow-Up</DialogTitle>
            <DialogDescription>Create a new follow-up item for yourself.</DialogDescription>
          </DialogHeader>
          <ClientCreateFollowUpForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

function DeadlineSection() {
  const { data: deadlines, isLoading } = useGetMyDeadlines();
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Clock className="h-5 w-5 text-primary" />
            Deadlines
          </CardTitle>
          <CardDescription>Deadlines assigned to you or created by you.</CardDescription>
        </div>
        <Button size="sm" onClick={() => setOpen(true)} className="shrink-0">
          <Plus className="h-4 w-4 mr-1" />
          Add Deadline
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Urgency</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <LoadingRows cols={5} />
            ) : !deadlines || deadlines.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5}>
                  <EmptyState icon={Clock} message="No deadlines yet. Add one to get started." />
                </TableCell>
              </TableRow>
            ) : (
              deadlines.map((record: DeadlineRecord) => (
                <TableRow key={record.id.toString()}>
                  <TableCell className="font-medium">{record.title}</TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {record.description || '—'}
                  </TableCell>
                  <TableCell className="text-sm">{formatDate(record.dueDate)}</TableCell>
                  <TableCell>
                    <UrgencyBadge level={record.urgencyLevel} />
                  </TableCell>
                  <TableCell>
                    <DeadlineStatusBadge status={record.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Add Deadline</DialogTitle>
            <DialogDescription>Create a new deadline for yourself.</DialogDescription>
          </DialogHeader>
          <ClientCreateDeadlineForm onSuccess={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ClientTasksTab() {
  return (
    <div className="space-y-6">
      <ToDoSection />
      <TimelineSection />
      <FollowUpSection />
      <DeadlineSection />
    </div>
  );
}
