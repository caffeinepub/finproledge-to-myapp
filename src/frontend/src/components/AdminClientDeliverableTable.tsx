import { Badge } from "@/components/ui/badge";
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
  CheckCircle,
  Download,
  Search,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { type ClientDeliverable, ClientDeliverableStatus } from "../backend";
import {
  useGetAllClientDeliverables,
  useUpdateClientDeliverableStatus,
} from "../hooks/useClientDeliverables";
import { useGetUserProfileByPrincipal } from "../hooks/useUserProfile";
import {
  downloadExternalBlob,
  getMimeTypeFromFilename,
} from "../utils/fileDownload";
import DownloadOptionsMenu from "./DownloadOptionsMenu";

type SortField = "title" | "submitter" | "status" | "createdAt";
type SortDir = "asc" | "desc";

function StatusBadge({ status }: { status: ClientDeliverableStatus }) {
  const map: Record<
    ClientDeliverableStatus,
    { label: string; className: string }
  > = {
    [ClientDeliverableStatus.pending]: {
      label: "Pending",
      className:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    },
    [ClientDeliverableStatus.accepted]: {
      label: "Accepted",
      className:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    },
    [ClientDeliverableStatus.rejected]: {
      label: "Rejected",
      className: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    },
  };
  const { label, className } = map[status] ?? {
    label: String(status),
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
        <div className="text-xs text-muted-foreground font-mono truncate max-w-[140px]">
          {principal}
        </div>
      </div>
    );
  }
  return (
    <span className="font-mono text-xs truncate max-w-[140px] block">
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

export default function AdminClientDeliverableTable() {
  const { data: deliverables = [], isLoading } = useGetAllClientDeliverables();
  const updateStatus = useUpdateClientDeliverableStatus();

  const [titleFilter, setTitleFilter] = useState("");
  const [clientFilter, setClientFilter] = useState("");
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

  const filtered = deliverables
    .filter((d) => {
      const titleMatch = d.title
        .toLowerCase()
        .includes(titleFilter.toLowerCase());
      const clientMatch = d.submitter
        .toString()
        .toLowerCase()
        .includes(clientFilter.toLowerCase());
      const statusMatch = statusFilter === "all" || d.status === statusFilter;
      return titleMatch && clientMatch && statusMatch;
    })
    .sort((a, b) => {
      let cmp = 0;
      if (sortField === "title") cmp = a.title.localeCompare(b.title);
      else if (sortField === "submitter")
        cmp = a.submitter.toString().localeCompare(b.submitter.toString());
      else if (sortField === "status")
        cmp = String(a.status).localeCompare(String(b.status));
      else if (sortField === "createdAt")
        cmp = Number(a.createdAt) - Number(b.createdAt);
      return sortDir === "asc" ? cmp : -cmp;
    });

  const handleDownload = async (deliverable: ClientDeliverable) => {
    setDownloadingId(deliverable.id);
    try {
      const mimeType = getMimeTypeFromFilename(deliverable.title);
      await downloadExternalBlob(deliverable.file, deliverable.title, mimeType);
    } catch {
      // handled in utility
    } finally {
      setDownloadingId(null);
    }
  };

  const handleApprove = async (id: bigint) => {
    await updateStatus.mutateAsync({
      deliverableId: id,
      newStatus: ClientDeliverableStatus.accepted,
    });
  };

  const handleReject = async (id: bigint) => {
    await updateStatus.mutateAsync({
      deliverableId: id,
      newStatus: ClientDeliverableStatus.rejected,
    });
  };

  const tableData = filtered.map((d) => ({
    Title: d.title,
    Submitter: d.submitter.toString(),
    Status: String(d.status),
    "Created At": new Date(
      Number(d.createdAt) / 1_000_000,
    ).toLocaleDateString(),
    Description: d.description,
  }));

  const downloadFiles = filtered.map((d) => ({
    name: d.title,
    mimeType: getMimeTypeFromFilename(d.title),
    getBytes: () => d.file.getBytes(),
  }));

  const clearFilters = () => {
    setTitleFilter("");
    setClientFilter("");
    setStatusFilter("all");
  };

  const hasFilters = titleFilter || clientFilter || statusFilter !== "all";

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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-muted/40 rounded-lg border border-border">
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
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="h-9 text-sm">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value={ClientDeliverableStatus.pending}>
              Pending
            </SelectItem>
            <SelectItem value={ClientDeliverableStatus.accepted}>
              Accepted
            </SelectItem>
            <SelectItem value={ClientDeliverableStatus.rejected}>
              Rejected
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">
            {filtered.length} deliverable{filtered.length !== 1 ? "s" : ""}
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
        {filtered.length > 0 && (
          <DownloadOptionsMenu
            tableData={tableData}
            title="Client Deliverables"
            files={downloadFiles}
          />
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <p className="text-muted-foreground">No deliverables found.</p>
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
                    field="submitter"
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
                    label="Submitted"
                    field="createdAt"
                    sortField={sortField}
                    sortDir={sortDir}
                    onSort={handleSort}
                  />
                </TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.map((d) => (
                <TableRow key={String(d.id)} className="hover:bg-muted/20">
                  <TableCell className="font-medium max-w-[180px]">
                    <span className="truncate block">{d.title}</span>
                  </TableCell>
                  <TableCell>
                    <ClientCell principal={d.submitter.toString()} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={d.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(
                      Number(d.createdAt) / 1_000_000,
                    ).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <span className="truncate block text-sm text-muted-foreground">
                      {d.description}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownload(d)}
                        disabled={downloadingId === d.id}
                        className="gap-1"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {downloadingId === d.id ? "…" : "Download"}
                      </Button>
                      {d.status === ClientDeliverableStatus.pending && (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleApprove(d.id)}
                            disabled={updateStatus.isPending}
                            className="gap-1 text-green-700 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-950"
                          >
                            <CheckCircle className="h-3.5 w-3.5" />
                            Accept
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleReject(d.id)}
                            disabled={updateStatus.isPending}
                            className="gap-1 text-red-700 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-950"
                          >
                            <XCircle className="h-3.5 w-3.5" />
                            Reject
                          </Button>
                        </>
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
