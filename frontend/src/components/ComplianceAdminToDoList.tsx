import React, { useState, useMemo } from 'react';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetAllToDos } from '../hooks/useComplianceAdmin';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { ToDoItem, ToDoPriority, ToDoStatus } from '../backend';
import { ToDoStatusSelect } from './TaskStatusSelect';
import { Download, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import DownloadOptionsMenu, { DownloadFile } from './DownloadOptionsMenu';
import { genericSort, multiFilter, toggleSortDirection, SortState } from '../utils/tableHelpers';

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

function SortableHeader({
  label,
  columnKey,
  sortState,
  onSort,
}: {
  label: string;
  columnKey: string;
  sortState: SortState;
  onSort: (key: string) => void;
}) {
  const isActive = sortState.column === columnKey;
  const direction = isActive ? sortState.direction : null;

  return (
    <button
      type="button"
      onClick={() => onSort(columnKey)}
      className="flex items-center gap-1 hover:text-foreground transition-colors font-medium text-left w-full"
    >
      {label}
      {direction === 'asc' ? (
        <ArrowUp className="h-3 w-3 text-primary" />
      ) : direction === 'desc' ? (
        <ArrowDown className="h-3 w-3 text-primary" />
      ) : (
        <ArrowUpDown className="h-3 w-3 opacity-40" />
      )}
    </button>
  );
}

export default function ComplianceAdminToDoList() {
  const { data: todos, isLoading } = useGetAllToDos();

  // Sort state
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });

  // Filter state per column
  const [filters, setFilters] = useState<Record<string, string>>({
    title: '',
    client: '',
    priority: '',
    status: '',
    createdAt: '',
  });

  const handleSort = (key: string) => {
    setSortState((prev) => toggleSortDirection(prev.column, prev.direction, key));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ title: '', client: '', priority: '', status: '', createdAt: '' });
    setSortState({ column: null, direction: null });
  };

  const hasActiveFilters =
    Object.values(filters).some((v) => v !== '') || sortState.column !== null;

  // Build flat rows for sort/filter
  const flatRows = useMemo(() => {
    return (todos ?? []).map((t) => ({
      ...t,
      _clientStr: t.clientPrincipal?.toString() ?? '',
      _priorityStr: String(t.priority),
      _statusStr: String(t.status),
      _createdAtStr: new Date(Number(t.createdAt) / 1_000_000).toLocaleDateString(),
    }));
  }, [todos]);

  // Apply filters
  const filteredRows = useMemo(() => {
    const filterMap: Record<string, string> = {};
    if (filters.title) filterMap['title'] = filters.title;
    if (filters.client) filterMap['_clientStr'] = filters.client;
    if (filters.priority) filterMap['_priorityStr'] = filters.priority;
    if (filters.status) filterMap['_statusStr'] = filters.status;
    if (filters.createdAt) filterMap['_createdAtStr'] = filters.createdAt;
    return multiFilter(flatRows as Record<string, unknown>[], filterMap) as typeof flatRows;
  }, [flatRows, filters]);

  // Apply sort
  const sortedRows = useMemo(() => {
    if (!sortState.column || !sortState.direction) return filteredRows;
    const keyMap: Record<string, string> = {
      title: 'title',
      client: '_clientStr',
      priority: '_priorityStr',
      status: '_statusStr',
      createdAt: 'createdAt',
    };
    const key = keyMap[sortState.column] ?? sortState.column;
    return genericSort(
      filteredRows as Record<string, unknown>[],
      key,
      sortState.direction
    ) as typeof filteredRows;
  }, [filteredRows, sortState]);

  // Build DownloadFile[] with the correct shape: { name, mimeType, getBytes }
  const docFiles: DownloadFile[] = (todos ?? [])
    .filter((t) => !!t.document)
    .map((t) => ({
      name: t.document!.fileName,
      mimeType: t.document!.mimeType,
      getBytes: () => t.document!.file.getBytes(),
    }));

  const tableData = sortedRows.map((t) => ({
    id: String(t.id),
    title: t.title,
    description: t.description,
    priority: t._priorityStr,
    status: t._statusStr,
    client: t._clientStr || 'N/A',
    createdAt: t._createdAtStr,
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
      {/* Header row */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <h3 className="text-lg font-semibold">
          All To-Dos ({sortedRows.length}
          {sortedRows.length !== (todos?.length ?? 0) && ` of ${todos?.length ?? 0}`})
        </h3>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <Button variant="outline" size="sm" onClick={clearFilters}>
              <X className="h-3 w-3 mr-1" />
              Clear Filters
            </Button>
          )}
          <DownloadOptionsMenu
            tableData={tableData}
            title="To-Do List"
            files={docFiles}
          />
        </div>
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Filter by Title</Label>
          <Input
            placeholder="Search title…"
            value={filters.title}
            onChange={(e) => handleFilterChange('title', e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Filter by Client</Label>
          <Input
            placeholder="Search client…"
            value={filters.client}
            onChange={(e) => handleFilterChange('client', e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Filter by Priority</Label>
          <Select
            value={filters.priority || 'all'}
            onValueChange={(v) => handleFilterChange('priority', v === 'all' ? '' : v)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="All priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All priorities</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="low">Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Filter by Status</Label>
          <Select
            value={filters.status || 'all'}
            onValueChange={(v) => handleFilterChange('status', v === 'all' ? '' : v)}
          >
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder="All statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="inProgress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Filter by Date</Label>
          <Input
            placeholder="e.g. 1/1/2025"
            value={filters.createdAt}
            onChange={(e) => handleFilterChange('createdAt', e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </div>

      {sortedRows.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4 text-center">
          {hasActiveFilters ? 'No to-dos match the current filters.' : 'No to-do items found.'}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px]">
                  <SortableHeader label="Title" columnKey="title" sortState={sortState} onSort={handleSort} />
                </TableHead>
                <TableHead className="min-w-[180px]">
                  <SortableHeader label="Client" columnKey="client" sortState={sortState} onSort={handleSort} />
                </TableHead>
                <TableHead className="min-w-[100px]">
                  <SortableHeader label="Priority" columnKey="priority" sortState={sortState} onSort={handleSort} />
                </TableHead>
                <TableHead className="min-w-[140px]">
                  <SortableHeader label="Status" columnKey="status" sortState={sortState} onSort={handleSort} />
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <SortableHeader label="Created" columnKey="createdAt" sortState={sortState} onSort={handleSort} />
                </TableHead>
                <TableHead>Document</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((todo: ToDoItem & { _clientStr: string; _priorityStr: string; _statusStr: string; _createdAtStr: string }) => (
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
                    {todo._createdAtStr}
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
