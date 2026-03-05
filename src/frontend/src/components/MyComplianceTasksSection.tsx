import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download } from "lucide-react";

import { useState } from "react";
import {
  FollowUpStatus,
  TimelineStatus,
  ToDoPriority,
  ToDoStatus,
} from "../backend";
import {
  useGetMyFollowUps,
  useGetMyTimelines,
  useGetMyToDos,
} from "../hooks/useComplianceAdmin";
import { downloadExternalBlob } from "../utils/fileDownload";
import {
  FollowUpStatusSelect,
  TimelineStatusSelect,
  ToDoStatusSelect,
} from "./TaskStatusSelect";

function PriorityBadge({ priority }: { priority: ToDoPriority }) {
  const map: Record<ToDoPriority, { label: string; className: string }> = {
    [ToDoPriority.high]: {
      label: "High",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
    [ToDoPriority.medium]: {
      label: "Medium",
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    [ToDoPriority.low]: {
      label: "Low",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
  };
  const { label, className } = map[priority] ?? {
    label: String(priority),
    className: "",
  };
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}
    >
      {label}
    </span>
  );
}

export default function MyComplianceTasksSection() {
  const { data: todos = [], isLoading: todosLoading } = useGetMyToDos();
  const { data: timelines = [], isLoading: timelinesLoading } =
    useGetMyTimelines();
  const { data: followUps = [], isLoading: followUpsLoading } =
    useGetMyFollowUps();
  const [downloadingId, setDownloadingId] = useState<bigint | null>(null);

  const pendingTodos = todos.filter(
    (t) => t.status === ToDoStatus.pending,
  ).length;
  const inProgressTodos = todos.filter(
    (t) => t.status === ToDoStatus.inProgress,
  ).length;
  const completedTodos = todos.filter(
    (t) => t.status === ToDoStatus.completed,
  ).length;

  const handleDownload = async (todo: {
    id: bigint;
    document?: {
      file: import("../backend").ExternalBlob;
      fileName: string;
      mimeType: string;
    } | null;
  }) => {
    if (!todo.document) return;
    setDownloadingId(todo.id);
    try {
      await downloadExternalBlob(
        todo.document.file,
        todo.document.fileName,
        todo.document.mimeType,
      );
    } catch {
      // handled in utility
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 dark:bg-yellow-950/30 rounded-lg p-4 text-center border border-yellow-200 dark:border-yellow-800">
          <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-400">
            {pendingTodos}
          </div>
          <div className="text-sm text-yellow-600 dark:text-yellow-500 mt-1">
            Pending
          </div>
        </div>
        <div className="bg-blue-50 dark:bg-blue-950/30 rounded-lg p-4 text-center border border-blue-200 dark:border-blue-800">
          <div className="text-2xl font-bold text-blue-700 dark:text-blue-400">
            {inProgressTodos}
          </div>
          <div className="text-sm text-blue-600 dark:text-blue-500 mt-1">
            In Progress
          </div>
        </div>
        <div className="bg-green-50 dark:bg-green-950/30 rounded-lg p-4 text-center border border-green-200 dark:border-green-800">
          <div className="text-2xl font-bold text-green-700 dark:text-green-400">
            {completedTodos}
          </div>
          <div className="text-sm text-green-600 dark:text-green-500 mt-1">
            Completed
          </div>
        </div>
      </div>

      <Tabs defaultValue="todos">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todos">
            To-Dos
            {todos.length > 0 && (
              <span className="ml-1.5 bg-primary/20 text-primary text-xs rounded-full px-1.5 py-0.5">
                {todos.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="timelines">
            Timelines
            {timelines.length > 0 && (
              <span className="ml-1.5 bg-primary/20 text-primary text-xs rounded-full px-1.5 py-0.5">
                {timelines.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="followups">
            Follow-Ups
            {followUps.length > 0 && (
              <span className="ml-1.5 bg-primary/20 text-primary text-xs rounded-full px-1.5 py-0.5">
                {followUps.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        {/* To-Dos Tab */}
        <TabsContent value="todos" className="mt-4">
          {todosLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : todos.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No to-do items assigned to you.
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Priority</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Created</TableHead>
                    <TableHead className="font-semibold">Document</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {todos.map((todo) => (
                    <TableRow
                      key={String(todo.id)}
                      className="hover:bg-muted/20"
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div>{todo.title}</div>
                          {todo.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {todo.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <PriorityBadge priority={todo.priority} />
                      </TableCell>
                      <TableCell>
                        <ToDoStatusSelect
                          toDoId={todo.id}
                          currentStatus={todo.status}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(
                          Number(todo.createdAt) / 1_000_000,
                        ).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        {todo.document ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownload(todo)}
                            disabled={downloadingId === todo.id}
                            className="gap-1.5"
                          >
                            <Download className="h-3.5 w-3.5" />
                            {downloadingId === todo.id
                              ? "Downloading…"
                              : todo.document.fileName}
                          </Button>
                        ) : (
                          <span className="text-muted-foreground text-sm">
                            —
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Timelines Tab */}
        <TabsContent value="timelines" className="mt-4">
          {timelinesLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : timelines.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No timeline entries assigned to you.
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Start Date</TableHead>
                    <TableHead className="font-semibold">End Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {timelines.map((entry) => (
                    <TableRow
                      key={String(entry.id)}
                      className="hover:bg-muted/20"
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div>{entry.title}</div>
                          {entry.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {entry.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(
                          Number(entry.startDate) / 1_000_000,
                        ).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(
                          Number(entry.endDate) / 1_000_000,
                        ).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <TimelineStatusSelect
                          timelineId={entry.id}
                          currentStatus={entry.status}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>

        {/* Follow-Ups Tab */}
        <TabsContent value="followups" className="mt-4">
          {followUpsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
            </div>
          ) : followUps.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              No follow-up items assigned to you.
            </div>
          ) : (
            <div className="rounded-lg border border-border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30">
                    <TableHead className="font-semibold">Title</TableHead>
                    <TableHead className="font-semibold">Due Date</TableHead>
                    <TableHead className="font-semibold">Status</TableHead>
                    <TableHead className="font-semibold">Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {followUps.map((item) => (
                    <TableRow
                      key={String(item.id)}
                      className="hover:bg-muted/20"
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div>{item.title}</div>
                          {item.description && (
                            <div className="text-xs text-muted-foreground mt-0.5">
                              {item.description}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {new Date(
                          Number(item.dueDate) / 1_000_000,
                        ).toLocaleDateString("en-IN", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </TableCell>
                      <TableCell>
                        <FollowUpStatusSelect
                          followUpId={item.id}
                          currentStatus={item.status}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[200px]">
                        <span className="truncate block">
                          {item.notes || "—"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
