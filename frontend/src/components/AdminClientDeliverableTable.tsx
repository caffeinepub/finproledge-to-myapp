import React, { useState, useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  useGetAllClientDeliverables,
  useUpdateClientDeliverableStatus,
  useSubmitDeliverableForClient,
} from '../hooks/useClientDeliverables';
import { useListApprovals } from '../hooks/useApprovals';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { ClientDeliverableStatus } from '../backend';
import { toast } from 'sonner';
import { Download, Plus, CheckCircle, XCircle, ArrowUpDown, ArrowUp, ArrowDown, X } from 'lucide-react';
import DownloadOptionsMenu, { DownloadFile } from './DownloadOptionsMenu';
import { genericSort, multiFilter, toggleSortDirection, SortState } from '../utils/tableHelpers';

// ── Client cell with profile resolution ─────────────────────────────────────
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

// ── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: ClientDeliverableStatus }) {
  const map: Record<string, { label: string; className: string }> = {
    [ClientDeliverableStatus.pending]: {
      label: 'Pending',
      className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    },
    [ClientDeliverableStatus.accepted]: {
      label: 'Accepted',
      className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    },
    [ClientDeliverableStatus.rejected]: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    },
  };
  const { label, className } = map[status] ?? { label: String(status), className: '' };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

// ── Sortable column header ────────────────────────────────────────────────────
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

// ── Add deliverable form (admin submits on behalf of client) ─────────────────
function AddDeliverableForm({ onSuccess }: { onSuccess: () => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedClient, setSelectedClient] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const submitForClient = useSubmitDeliverableForClient();
  const { data: approvals } = useListApprovals();
  const approvedUsers = (approvals ?? []).filter((a) => a.status === 'approved');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !selectedClient || !file) {
      toast.error('Title, client, and file are required');
      return;
    }

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;

      submitForClient.mutate(
        {
          clientPrincipal: selectedClient,
          title,
          description,
          file: bytes,
        },
        {
          onSuccess: () => {
            toast.success('Deliverable submitted successfully');
            setTitle('');
            setDescription('');
            setSelectedClient('');
            setFile(null);
            onSuccess();
          },
          onError: (err) => {
            const msg = err instanceof Error ? err.message : 'Something went wrong';
            toast.error(`Failed to submit deliverable: ${msg}`);
          },
        }
      );
    } catch {
      toast.error('Failed to read file');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="del-title">Title *</Label>
        <Input
          id="del-title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Deliverable title"
          required
        />
      </div>
      <div>
        <Label htmlFor="del-desc">Description</Label>
        <Input
          id="del-desc"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description"
        />
      </div>
      <div>
        <Label htmlFor="del-client">Client *</Label>
        <Select value={selectedClient} onValueChange={setSelectedClient}>
          <SelectTrigger id="del-client">
            <SelectValue placeholder="Select client" />
          </SelectTrigger>
          <SelectContent>
            {approvedUsers.map((a) => {
              const ps = a.principal.toString();
              return (
                <SelectItem key={ps} value={ps}>
                  {ps.slice(0, 20)}…
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="del-file">File *</Label>
        <Input
          id="del-file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
        />
      </div>
      <Button type="submit" disabled={submitForClient.isPending} className="w-full">
        {submitForClient.isPending ? 'Submitting…' : 'Submit Deliverable'}
      </Button>
    </form>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function AdminClientDeliverableTable() {
  const { data: deliverables, isLoading } = useGetAllClientDeliverables();
  const updateStatus = useUpdateClientDeliverableStatus();
  const [dialogOpen, setDialogOpen] = useState(false);

  // Sort state
  const [sortState, setSortState] = useState<SortState>({ column: null, direction: null });

  // Filter state per column
  const [filters, setFilters] = useState<Record<string, string>>({
    title: '',
    submitter: '',
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
    setFilters({ title: '', submitter: '', status: '', createdAt: '' });
    setSortState({ column: null, direction: null });
  };

  const hasActiveFilters =
    Object.values(filters).some((v) => v !== '') || sortState.column !== null;

  // Build flat rows for sort/filter
  const flatRows = useMemo(() => {
    return (deliverables ?? []).map((d) => ({
      ...d,
      _submitterStr: d.submitter.toString(),
      _createdAtStr: new Date(Number(d.createdAt) / 1_000_000).toLocaleDateString(),
      _statusStr: String(d.status),
    }));
  }, [deliverables]);

  // Apply filters
  const filteredRows = useMemo(() => {
    const filterMap: Record<string, string> = {};
    if (filters.title) filterMap['title'] = filters.title;
    if (filters.submitter) filterMap['_submitterStr'] = filters.submitter;
    if (filters.status) filterMap['_statusStr'] = filters.status;
    if (filters.createdAt) filterMap['_createdAtStr'] = filters.createdAt;
    return multiFilter(
      flatRows as Record<string, unknown>[],
      filterMap
    ) as typeof flatRows;
  }, [flatRows, filters]);

  // Apply sort
  const sortedRows = useMemo(() => {
    if (!sortState.column || !sortState.direction) return filteredRows;
    const keyMap: Record<string, string> = {
      title: 'title',
      submitter: '_submitterStr',
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

  // Build DownloadFile[] with correct shape
  const docFiles: DownloadFile[] = (deliverables ?? []).map((d) => ({
    name: d.title,
    mimeType: 'application/octet-stream',
    getBytes: () => d.file.getBytes(),
  }));

  const tableData = sortedRows.map((d) => ({
    id: String(d.id),
    title: d.title,
    description: d.description,
    submitter: d._submitterStr,
    status: d._statusStr,
    createdAt: d._createdAtStr,
  }));

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => (
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
          Client Deliverables ({sortedRows.length}
          {sortedRows.length !== (deliverables?.length ?? 0) &&
            ` of ${deliverables?.length ?? 0}`}
          )
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
            title="Client Deliverables"
            files={docFiles}
          />
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                Add Deliverable
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Submit Deliverable for Client</DialogTitle>
              </DialogHeader>
              <AddDeliverableForm onSuccess={() => setDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filter row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
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
            value={filters.submitter}
            onChange={(e) => handleFilterChange('submitter', e.target.value)}
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
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
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
          {hasActiveFilters
            ? 'No deliverables match the current filters.'
            : 'No deliverables submitted yet.'}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="min-w-[160px]">
                  <SortableHeader
                    label="Title"
                    columnKey="title"
                    sortState={sortState}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="min-w-[180px]">
                  <SortableHeader
                    label="Client"
                    columnKey="submitter"
                    sortState={sortState}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="min-w-[120px]">
                  <SortableHeader
                    label="Status"
                    columnKey="status"
                    sortState={sortState}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="min-w-[120px]">
                  <SortableHeader
                    label="Submitted"
                    columnKey="createdAt"
                    sortState={sortState}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead>File</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRows.map((deliverable) => (
                <TableRow key={String(deliverable.id)}>
                  <TableCell className="font-medium">{deliverable.title}</TableCell>
                  <TableCell>
                    <ClientCell principalStr={deliverable._submitterStr} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {deliverable.description || '—'}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={deliverable.status} />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {deliverable._createdAtStr}
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={async () => {
                        try {
                          const bytes = await deliverable.file.getBytes();
                          const blob = new Blob([bytes], {
                            type: 'application/octet-stream',
                          });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = deliverable.title;
                          a.click();
                          URL.revokeObjectURL(url);
                        } catch {
                          toast.error('Failed to download file');
                        }
                      }}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      {deliverable.status !== ClientDeliverableStatus.accepted && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate(
                              {
                                deliverableId: deliverable.id,
                                newStatus: ClientDeliverableStatus.accepted,
                              },
                              {
                                onSuccess: () => toast.success('Deliverable accepted'),
                                onError: () => toast.error('Failed to update status'),
                              }
                            )
                          }
                        >
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                      )}
                      {deliverable.status !== ClientDeliverableStatus.rejected && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          disabled={updateStatus.isPending}
                          onClick={() =>
                            updateStatus.mutate(
                              {
                                deliverableId: deliverable.id,
                                newStatus: ClientDeliverableStatus.rejected,
                              },
                              {
                                onSuccess: () => toast.success('Deliverable rejected'),
                                onError: () => toast.error('Failed to update status'),
                              }
                            )
                          }
                        >
                          <XCircle className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
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
