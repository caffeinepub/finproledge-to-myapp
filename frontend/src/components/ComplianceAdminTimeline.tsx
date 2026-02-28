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
import { useGetAllTimelines } from '../hooks/useComplianceAdmin';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { TimelineStatus } from '../backend';
import { TimelineStatusSelect } from './TaskStatusSelect';
import { ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import { genericSort, multiFilter, toggleSortDirection, SortState } from '../utils/tableHelpers';

function StatusBadge({ status }: { status: TimelineStatus }) {
  const map: Record<string, string> = {
    planned: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    inProgress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };
  const label =
    status === TimelineStatus.planned
      ? 'Planned'
      : status === TimelineStatus.inProgress
      ? 'In Progress'
      : 'Completed';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? ''}`}>
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

function formatDate(ns: bigint) {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString();
}

export default function ComplianceAdminTimeline() {
  const { data: timelines, isLoading } = useGetAllTimelines();

  // Sort state
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });

  // Filter state per column
  const [filters, setFilters] = useState<Record<string, string>>({
    title: '',
    client: '',
    status: '',
    startDate: '',
    endDate: '',
  });

  const handleSort = (key: string) => {
    setSortState((prev) => toggleSortDirection(prev.column, prev.direction, key));
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ title: '', client: '', status: '', startDate: '', endDate: '' });
    setSortState({ column: null, direction: null });
  };

  const hasActiveFilters =
    Object.values(filters).some((v) => v !== '') || sortState.column !== null;

  // Build flat rows for sort/filter
  const flatRows = useMemo(() => {
    return (timelines ?? []).map((t) => ({
      ...t,
      _clientStr: t.clientPrincipal?.toString() ?? '',
      _statusStr: String(t.status),
      _startDateStr: formatDate(t.startDate),
      _endDateStr: formatDate(t.endDate),
    }));
  }, [timelines]);

  // Apply filters
  const filteredRows = useMemo(() => {
    const filterMap: Record<string, string> = {};
    if (filters.title) filterMap['title'] = filters.title;
    if (filters.client) filterMap['_clientStr'] = filters.client;
    if (filters.status) filterMap['_statusStr'] = filters.status;
    if (filters.startDate) filterMap['_startDateStr'] = filters.startDate;
    if (filters.endDate) filterMap['_endDateStr'] = filters.endDate;
    return multiFilter(flatRows as Record<string, unknown>[], filterMap) as typeof flatRows;
  }, [flatRows, filters]);

  // Apply sort
  const sortedRows = useMemo(() => {
    if (!sortState.column || !sortState.direction) return filteredRows;
    const keyMap: Record<string, string> = {
      title: 'title',
      client: '_clientStr',
      status: '_statusStr',
      startDate: 'startDate',
      endDate: 'endDate',
    };
    const key = keyMap[sortState.column] ?? sortState.column;
    return genericSort(
      filteredRows as Record<string, unknown>[],
      key,
      sortState.direction
    ) as typeof filteredRows;
  }, [filteredRows, sortState]);

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
          All Timelines ({sortedRows.length}
          {sortedRows.length !== (timelines?.length ?? 0) && ` of ${timelines?.length ?? 0}`})
        </h3>
        {hasActiveFilters && (
          <Button variant="outline" size="sm" onClick={clearFilters}>
            <X className="h-3 w-3 mr-1" />
            Clear Filters
          </Button>
        )}
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
              <SelectItem value="planned">Planned</SelectItem>
              <SelectItem value="inProgress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Filter by Start Date</Label>
          <Input
            placeholder="e.g. 1/1/2025"
            value={filters.startDate}
            onChange={(e) => handleFilterChange('startDate', e.target.value)}
            className="h-8 text-sm"
          />
        </div>
        <div>
          <Label className="text-xs text-muted-foreground mb-1 block">Filter by End Date</Label>
          <Input
            placeholder="e.g. 12/31/2025"
            value={filters.endDate}
            onChange={(e) => handleFilterChange('endDate', e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </div>

      {sortedRows.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4 text-center">
          {hasActiveFilters ? 'No timelines match the current filters.' : 'No timeline entries found.'}
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
                <TableHead className="min-w-[120px]">
                  <SortableHeader label="Start Date" columnKey="startDate" sortState={sortState} onSort={handleSort} />
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <SortableHeader label="End Date" columnKey="endDate" sortState={sortState} onSort={handleSort} />
                </TableHead>
                <TableHead className="min-w-[140px]">
                  <SortableHeader label="Status" columnKey="status" sortState={sortState} onSort={handleSort} />
                </TableHead>
                <TableHead>Task Ref</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((entry) => (
                <TableRow key={String(entry.id)}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{entry.title}</div>
                      {entry.description && (
                        <div className="text-xs text-muted-foreground mt-0.5">{entry.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {entry.clientPrincipal ? (
                      <ClientCell principalStr={entry.clientPrincipal.toString()} />
                    ) : (
                      <span className="text-muted-foreground text-xs">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">{entry._startDateStr}</TableCell>
                  <TableCell className="text-xs">{entry._endDateStr}</TableCell>
                  <TableCell>
                    <TimelineStatusSelect
                      timelineId={entry.id}
                      currentStatus={entry.status}
                    />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {entry.taskReference != null ? String(entry.taskReference) : '—'}
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
