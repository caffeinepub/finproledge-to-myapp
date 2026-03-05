import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Download,
  Search,
} from "lucide-react";
import React, { useState } from "react";
import { type ToDoItem, ToDoPriority, ToDoStatus } from "../backend";
import { useGetAllToDos } from "../hooks/useComplianceAdmin";
import { useGetUserProfileByPrincipal } from "../hooks/useUserProfile";
import { downloadExternalBlob } from "../utils/fileDownload";
import { ToDoStatusSelect } from "./TaskStatusSelect";

type SortField = "title" | "client" | "priority" | "status" | "createdAt";
type SortDir = "asc" | "desc";

const PRIORITY_ORDER: Record<string, number> = {
  [ToDoPriority.high]: 0,
  [ToDoPriority.medium]: 1,
  [ToDoPriority.low]: 2,
};

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

function ClientCell({ principal }: { principal: string }) {
  const { data: profile } = useGetUserProfileByPrincipal(principal);
  if (profile) {
    return (
      <div>
        <div className="font-medium text-sm">{profile.name}</div>
        <div className="text-xs text-muted-foreground">{profile.company}</div>
      </div>
    );
  }
  return (
    <span className="font-mono text-xs truncate max-w-[120px] block">
      {principal}
    </span>
  );
}

function SortableHeader({
  label,
  field,
  sortField,
  sortDir,
  onSort,
}: {
  label: string;
  field: SortField;
  sortField: SortField;
  sortDir: SortDir;
  onSort: (f: SortField) => void;
}) {
  const active = sortField === field;
  return (
    <button
      type="button"
      className="flex items-center gap-1 font-semibold hover:text-foreground transition-colors"
      onClick={() => onSort(field)}
    >
      {label}
      {active ? (
        sortDir === "asc" ? (
          <ArrowUp className="h-3 w-3" />
        ) : (
          <ArrowDown className="h-3 w-3" />
        )
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-40" />
      )}
    </button>
  );
}

export default function ComplianceAdminToDoList() {
  const { data: todos = [], isLoading } = useGetAllToDos();

  const [titleFilter, setTitleFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [downloadingId, setDownloadingId] = useState<bigint | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDir("asc");
    }
  };

  const filtered = todos
    .filter((todo) => {
      const titleMatch = todo.title
        .toLowerCase()
        .includes(titleFilter.toLowerCase());
      const clientStr = todo.clientPrincipal
        ? todo.clientPrincipal.toString()
        : "";
      const clientMatch = clientStr
        .toLowerCase()
        .includes(clientFilter.toLowerCase());
      const priorityMatch =
        priorityFilter === "all" || todo.priority === priorityFilter;
      const statusMatch =
        statusFilter === "all" || todo.status === statusFilter;
      return titleMatch && clientMatch && priorityMatch && statusMatch;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "title") cmp = a.title.localeCompare(b.title);
      else if (sortField === "client") {
        const aStr = a.clientPrincipal ? a.clientPrincipal.toString() : "";
        const bStr = b.clientPrincipal ? b.clientPrincipal.toString() : "";
        cmp = aStr.localeCompare(bStr);
      } else if (sortField === "priority") {
        cmp =
          (PRIORITY_ORDER[String(a.priority)] ?? 99) -
          (PRIORITY_ORDER[String(b.priority)] ?? 99);
      } else if (sortField === "status") {
        cmp = String(a.status).localeCompare(String(b.status));
      } else if (sortField === "createdAt") {
        cmp = Number(a.createdAt) - Number(b.createdAt);
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

  const handleDownload = async (todo: ToDoItem) => {
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

  const clearFilters = () => {
    setTitleFilter("");
    setClientFilter("");
    setPriorityFilter("all");
    setStatusFilter("all");
  };

  const hasFilters =
    titleFilter ||
    clientFilter ||
    priorityFilter !== "all" ||
    statusFilter !== "all";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-3 bg-muted/40 rounded-lg border border-border">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by title…"
            value={titleFilter}
            onChange={(e) => setTitleFilter(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Filter by client…"
            value={clientFilter}
            onChange={(e) => setClientFilter(e.target.value)}
            className="pl-8 h-9 text-sm"
          />
        </div>
        <Select value={priorityFilter} onValueChange={setPriorityFilter}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="All Priorities" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value={ToDoPriority.high}>High</SelectItem>
            <SelectItem value={ToDoPriority.medium}>Medium</SelectItem>
            <SelectItem value={ToDoPriority.low}>Low</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={ToDoStatus.pending}>Pending</SelectItem>
            <SelectItem value={ToDoStatus.inProgress}>In Progress</SelectItem>
            <SelectItem value={ToDoStatus.completed}>Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filtered.length} item{filtered.length !== 1 ? "s" : ""}
          </span>
          {hasFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 text-xs"
            >
              Clear Filters
            </Button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No to-do items found.</p>
          {hasFilters && (
            <Button
              variant="link"
              size="sm"
              onClick={clearFilters}
              className="mt-1"
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead>
                  <SortableHeader
                    label="Title"
                    field="title"
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead>
                  <SortableHeader
                    label="Client"
                    field="client"
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead>
                  <SortableHeader
                    label="Priority"
                    field="priority"
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead>
                  <SortableHeader
                    label="Status"
                    field="status"
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead>
                  <SortableHeader
                    label="Created"
                    field="createdAt"
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="font-semibold">Document</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((todo) => (
                <TableRow key={String(todo.id)} className="hover:bg-muted/20">
                  <TableCell className="font-medium max-w-[180px]">
                    <div>
                      <div className="truncate">{todo.title}</div>
                      {todo.description && (
                        <div className="text-xs text-muted-foreground truncate max-w-[160px]">
                          {todo.description}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {todo.clientPrincipal ? (
                      <ClientCell principal={todo.clientPrincipal.toString()} />
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
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
                      <span className="text-muted-foreground text-sm">—</span>
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
