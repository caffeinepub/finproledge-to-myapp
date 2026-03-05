import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Principal } from "@dfinity/principal";
import { Link } from "@tanstack/react-router";
import {
  BarChart2,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  ExternalLink,
  FileText,
  Filter,
  Package,
  Phone,
  Search,
  Settings,
  UserCheck,
  Users,
  XCircle,
} from "lucide-react";
import React, { useState } from "react";
import { toast } from "sonner";
import {
  ApprovalStatus,
  DeliverableType,
  type Lead,
  type RequestStatus,
  type ServiceRequest,
  type UserApprovalInfo,
} from "../backend";
import AdminClientDeliverableTable from "../components/AdminClientDeliverableTable";
import AdminGuard from "../components/AdminGuard";
import AdminPaymentSettings from "../components/AdminPaymentSettings";
import AdminPaymentTable from "../components/AdminPaymentTable";
import AnalyticsDashboard from "../components/AnalyticsDashboard";
import DocumentTable from "../components/DocumentTable";
import { useListApprovals, useSetApproval } from "../hooks/useApprovals";
import {
  useCreateDeliverable,
  useGetAllComplianceDeliverables,
} from "../hooks/useDeliverables";
import { useGetAllDocuments, useGetAllLeads } from "../hooks/useDocuments";
import {
  useGetAllRequests,
  useUpdateRequestStatus,
} from "../hooks/useServiceRequests";
import { useGetUserProfileByPrincipal } from "../hooks/useUserProfile";

// ─── Helpers ────────────────────────────────────────────────────────────────

function statusLabel(status: RequestStatus): string {
  const map: Record<string, string> = {
    pending: "Pending",
    inProgress: "In Progress",
    completed: "Completed",
    cancelled: "Cancelled",
  };
  return map[String(status)] ?? String(status);
}

function statusColor(status: RequestStatus): string {
  const map: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    inProgress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    completed:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return map[String(status)] ?? "";
}

function serviceTypeLabel(type: string): string {
  const map: Record<string, string> = {
    incomeTaxFiling: "Income Tax Filing",
    corporateTaxFiling: "Corporate Tax Filing",
    audits: "Audits",
    payrollAdmin: "Payroll Admin",
    ledgerMaintenance: "Ledger Maintenance",
    bankReconciliation: "Bank Reconciliation",
    gstFiling: "GST Filing",
    tdsFiling: "TDS Filing",
    financialManagement: "Financial Management",
    accountingServices: "Accounting Services",
    loanFinancing: "Loan Financing",
    other: "Other",
  };
  return map[type] ?? type;
}

function approvalStatusLabel(status: ApprovalStatus): string {
  const map: Record<string, string> = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
  };
  return map[String(status)] ?? String(status);
}

function approvalStatusColor(status: ApprovalStatus): string {
  const map: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    approved:
      "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  };
  return map[String(status)] ?? "";
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function UserProfileCell({ principal }: { principal: string }) {
  const { data: profile } = useGetUserProfileByPrincipal(principal);
  if (profile) {
    return (
      <div>
        <div className="font-medium text-sm">{profile.name}</div>
        <div className="text-xs text-muted-foreground">{profile.company}</div>
        <div className="text-xs text-muted-foreground font-mono truncate max-w-[160px]">
          {principal}
        </div>
      </div>
    );
  }
  return (
    <span className="font-mono text-xs truncate max-w-[160px] block">
      {principal}
    </span>
  );
}

function RequestsTab() {
  const { data: requests = [], isLoading } = useGetAllRequests();
  const updateStatus = useUpdateRequestStatus();
  const [activeServiceFilter, setActiveServiceFilter] = useState<string | null>(
    null,
  );

  if (isLoading) {
    return (
      <div
        className="flex justify-center py-12"
        data-ocid="requests.loading_state"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Build service breakdown counts
  const serviceBreakdown = requests.reduce<Record<string, number>>(
    (acc, req) => {
      const key = String(req.serviceType);
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {},
  );

  // Filter requests by active service type
  const filteredRequests = activeServiceFilter
    ? requests.filter((r) => String(r.serviceType) === activeServiceFilter)
    : requests;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">All Service Requests</h3>
        <span className="text-sm text-muted-foreground">
          {requests.length} total
        </span>
      </div>

      {/* Service Summary Banner */}
      {requests.length > 0 && (
        <div className="rounded-lg border border-border bg-muted/20 px-4 py-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-muted-foreground flex items-center gap-1.5 mr-1">
              <Filter className="h-3.5 w-3.5" />
              Service Breakdown:
            </span>
            {Object.entries(serviceBreakdown).map(([type, count]) => (
              <button
                key={type}
                type="button"
                onClick={() =>
                  setActiveServiceFilter(
                    activeServiceFilter === type ? null : type,
                  )
                }
                className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-colors border ${
                  activeServiceFilter === type
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
                data-ocid="requests.tab"
              >
                <Link
                  to="/service-booking"
                  onClick={(e) => e.stopPropagation()}
                  className="hover:underline flex items-center gap-1"
                >
                  {serviceTypeLabel(type)}
                  <ExternalLink className="h-2.5 w-2.5 opacity-60" />
                </Link>
                <span
                  className={`ml-1 font-bold ${activeServiceFilter === type ? "text-primary-foreground" : "text-primary"}`}
                >
                  ({count})
                </span>
              </button>
            ))}
            {activeServiceFilter && (
              <button
                type="button"
                onClick={() => setActiveServiceFilter(null)}
                className="text-xs text-muted-foreground hover:text-foreground underline ml-2 transition-colors"
              >
                Clear filter
              </button>
            )}
          </div>
        </div>
      )}

      {requests.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="requests.empty_state"
        >
          No service requests yet.
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table data-ocid="requests.table">
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Service</TableHead>
                <TableHead className="font-semibold">Description</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Created</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRequests.map((req, idx) => (
                <TableRow
                  key={String(req.id)}
                  className="hover:bg-muted/20"
                  data-ocid={`requests.item.${idx + 1}`}
                >
                  <TableCell>
                    {req.name ? (
                      <div>
                        <div className="font-medium text-sm">{req.name}</div>
                        {req.email && (
                          <div className="text-xs text-muted-foreground">
                            {req.email}
                          </div>
                        )}
                        {req.company && (
                          <div className="text-xs text-muted-foreground">
                            {req.company}
                          </div>
                        )}
                        {req.phone && (
                          <div className="text-xs text-muted-foreground flex items-center gap-1">
                            <Phone className="h-2.5 w-2.5" />
                            {req.phone}
                          </div>
                        )}
                      </div>
                    ) : (
                      <UserProfileCell principal={req.client.toString()} />
                    )}
                  </TableCell>
                  <TableCell className="text-sm">
                    <Link
                      to="/service-booking"
                      className="inline-flex items-center gap-1 text-primary hover:text-primary/80 hover:underline font-medium transition-colors"
                    >
                      {serviceTypeLabel(String(req.serviceType))}
                      <ExternalLink className="h-3 w-3 opacity-60" />
                    </Link>
                  </TableCell>
                  <TableCell className="max-w-[200px]">
                    <span className="truncate block text-sm text-muted-foreground">
                      {req.description}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColor(req.status)}`}
                    >
                      {statusLabel(req.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(
                      Number(req.createdAt) / 1_000_000,
                    ).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={String(req.status)}
                      onValueChange={async (val) => {
                        await updateStatus.mutateAsync({
                          requestId: req.id,
                          status: val as RequestStatus,
                        });
                      }}
                    >
                      <SelectTrigger
                        className="h-8 w-36 text-xs"
                        data-ocid="requests.select"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inProgress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
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

function DocumentsTab() {
  const { data: documents = [], isLoading } = useGetAllDocuments();

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">All Client Documents</h3>
        <span className="text-sm text-muted-foreground">
          {documents.length} total
        </span>
      </div>
      <DocumentTable documents={documents} isAdmin={true} />
    </div>
  );
}

function DeliverablesTab() {
  const { data: deliverables = [], isLoading } =
    useGetAllComplianceDeliverables();
  const createDeliverable = useCreateDeliverable();
  const [open, setOpen] = useState(false);
  const [clientPrincipalStr, setClientPrincipalStr] = useState("");
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [deliverableType, setDeliverableType] = useState<DeliverableType>(
    DeliverableType.monthly,
  );

  const handleCreate = async () => {
    if (!clientPrincipalStr || !title || !dueDate) return;
    try {
      const clientPrincipal = Principal.fromText(clientPrincipalStr);
      const dueDateMs = new Date(dueDate).getTime();
      await createDeliverable.mutateAsync({
        clientPrincipal,
        title,
        dueDate: BigInt(dueDateMs) * 1_000_000n,
        deliverableType,
      });
      toast.success("Deliverable created successfully");
      setOpen(false);
      setClientPrincipalStr("");
      setTitle("");
      setDueDate("");
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to create deliverable";
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Compliance Deliverables</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">+ Add Deliverable</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Deliverable</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div>
                <label
                  htmlFor="dlv-client-principal"
                  className="text-sm font-medium"
                >
                  Client Principal
                </label>
                <input
                  id="dlv-client-principal"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={clientPrincipalStr}
                  onChange={(e) => setClientPrincipalStr(e.target.value)}
                  placeholder="e.g. aaaaa-aa"
                />
              </div>
              <div>
                <label htmlFor="dlv-title" className="text-sm font-medium">
                  Title
                </label>
                <input
                  id="dlv-title"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Deliverable title"
                />
              </div>
              <div>
                <label htmlFor="dlv-due-date" className="text-sm font-medium">
                  Due Date
                </label>
                <input
                  id="dlv-due-date"
                  type="date"
                  className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="dlv-type" className="text-sm font-medium">
                  Type
                </label>
                <Select
                  value={deliverableType}
                  onValueChange={(v) =>
                    setDeliverableType(v as DeliverableType)
                  }
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={DeliverableType.monthly}>
                      Monthly
                    </SelectItem>
                    <SelectItem value={DeliverableType.quarterly}>
                      Quarterly
                    </SelectItem>
                    <SelectItem value={DeliverableType.annual}>
                      Annual
                    </SelectItem>
                    <SelectItem value={DeliverableType.consulting}>
                      Consulting
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                className="w-full"
                onClick={handleCreate}
                disabled={
                  createDeliverable.isPending ||
                  !clientPrincipalStr ||
                  !title ||
                  !dueDate
                }
              >
                {createDeliverable.isPending
                  ? "Creating…"
                  : "Create Deliverable"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      {deliverables.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No compliance deliverables yet.
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliverables.map((d) => (
                <TableRow key={String(d.id)} className="hover:bg-muted/20">
                  <TableCell>
                    <UserProfileCell principal={d.client.toString()} />
                  </TableCell>
                  <TableCell className="font-medium">{d.title}</TableCell>
                  <TableCell className="text-sm capitalize">
                    {String(d.deliverableType)}
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {String(d.status)}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                    {new Date(Number(d.dueDate) / 1_000_000).toLocaleDateString(
                      "en-IN",
                      {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      },
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

function authStatusLabel(status: ApprovalStatus): string {
  const map: Record<string, string> = {
    pending: "Awaiting Activation",
    approved: "Access Granted",
    rejected: "Access Revoked",
  };
  return map[String(status)] ?? String(status);
}

function authStatusBadgeClass(status: ApprovalStatus): string {
  const map: Record<string, string> = {
    pending:
      "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-300 dark:border-yellow-700",
    approved:
      "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-700",
    rejected:
      "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-700",
  };
  return map[String(status)] ?? "";
}

function ApprovalsTab() {
  // Poll every 30 seconds to capture new registration requests in real time
  const { data: approvals = [], isLoading } = useListApprovals({
    refetchInterval: 30000,
  });
  const setApproval = useSetApproval();

  const handleApprove = async (principalStr: string) => {
    try {
      const user = Principal.fromText(principalStr);
      await setApproval.mutateAsync({ user, status: ApprovalStatus.approved });
      toast.success("User approved successfully");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to approve user";
      toast.error(msg);
    }
  };

  const handleReject = async (principalStr: string) => {
    try {
      const user = Principal.fromText(principalStr);
      await setApproval.mutateAsync({ user, status: ApprovalStatus.rejected });
      toast.success("User rejected");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to reject user";
      toast.error(msg);
    }
  };

  if (isLoading) {
    return (
      <div
        className="flex justify-center py-12"
        data-ocid="approvals.loading_state"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">User Approvals</h3>
        <span className="text-sm text-muted-foreground">
          {approvals.length} user{approvals.length !== 1 ? "s" : ""}
        </span>
      </div>

      {approvals.length === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="approvals.empty_state"
        >
          No approval requests yet. Users will appear here after they log in for
          the first time.
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table data-ocid="approvals.table">
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">User</TableHead>
                <TableHead className="font-semibold">Principal</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Auth Status</TableHead>
                <TableHead className="font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((approval: UserApprovalInfo) => {
                const principalStr = approval.principal.toString();
                return (
                  <ApprovalRow
                    key={principalStr}
                    approval={approval}
                    principalStr={principalStr}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isPending={setApproval.isPending}
                  />
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}

function ApprovalRow({
  approval,
  principalStr,
  onApprove,
  onReject,
  isPending,
}: {
  approval: UserApprovalInfo;
  principalStr: string;
  onApprove: (p: string) => void;
  onReject: (p: string) => void;
  isPending: boolean;
}) {
  const { data: profile } = useGetUserProfileByPrincipal(principalStr);
  const isApproved = String(approval.status) === ApprovalStatus.approved;
  const isRejected = String(approval.status) === ApprovalStatus.rejected;

  return (
    <TableRow className="hover:bg-muted/20">
      <TableCell>
        {profile ? (
          <div>
            <div className="font-medium text-sm">{profile.name}</div>
            <div className="text-xs text-muted-foreground">{profile.email}</div>
            <div className="text-xs text-muted-foreground">
              {profile.company}
            </div>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground italic">
            No profile
          </span>
        )}
      </TableCell>
      <TableCell>
        <span className="font-mono text-xs truncate max-w-[160px] block">
          {principalStr}
        </span>
      </TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${approvalStatusColor(approval.status)}`}
        >
          {approvalStatusLabel(approval.status)}
        </span>
      </TableCell>
      <TableCell>
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${authStatusBadgeClass(approval.status)}`}
        >
          {authStatusLabel(approval.status)}
        </span>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          {!isApproved && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 text-green-700 border-green-300 hover:bg-green-50 dark:text-green-400 dark:border-green-700 dark:hover:bg-green-950"
              onClick={() => onApprove(principalStr)}
              disabled={isPending}
              data-ocid="approvals.confirm_button"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Approve
            </Button>
          )}
          {!isRejected && (
            <Button
              size="sm"
              variant="outline"
              className="h-7 text-xs gap-1 text-red-700 border-red-300 hover:bg-red-50 dark:text-red-400 dark:border-red-700 dark:hover:bg-red-950"
              onClick={() => onReject(principalStr)}
              disabled={isPending}
              data-ocid="approvals.delete_button"
            >
              <XCircle className="h-3.5 w-3.5" />
              Reject
            </Button>
          )}
          {isApproved && isRejected && (
            <span className="text-xs text-muted-foreground">—</span>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Contacts Tab ─────────────────────────────────────────────────────────────

function ContactsTab() {
  const { data: approvals = [], isLoading: approvalsLoading } =
    useListApprovals({ refetchInterval: 30000 });
  const { data: leads = [], isLoading: leadsLoading } = useGetAllLeads({
    refetchInterval: 30000,
  });
  const { data: allRequests = [], isLoading: requestsLoading } =
    useGetAllRequests();
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedContact, setExpandedContact] = useState<string | null>(null);

  const isLoading = approvalsLoading || leadsLoading || requestsLoading;

  if (isLoading) {
    return (
      <div
        className="flex justify-center py-12"
        data-ocid="contacts.loading_state"
      >
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  // Build contacts list: filter out anonymous users from approvals
  const registeredContacts = approvals.filter((a: UserApprovalInfo) => {
    const principalStr = a.principal.toString();
    return principalStr !== "" && principalStr !== "2vxsx-fae";
  });

  // Show all leads. In a more advanced version we could deduplicate by phone/name.
  const leadsToShow = leads;

  const totalContacts = registeredContacts.length + leadsToShow.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Contacts</h3>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 font-medium border border-green-200 dark:border-green-700">
              {registeredContacts.length} Registered
            </span>
          </span>
          <span className="text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300 font-medium border border-amber-200 dark:border-amber-700">
              {leadsToShow.length} Leads
            </span>
          </span>
          <span className="text-sm text-muted-foreground">
            {totalContacts} total
          </span>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by name, company, or phone…"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9 h-9 text-sm"
          data-ocid="contacts.search_input"
        />
      </div>

      {totalContacts === 0 ? (
        <div
          className="text-center py-12 text-muted-foreground"
          data-ocid="contacts.empty_state"
        >
          No contacts found. Users will appear here after they register or
          submit a service request.
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden divide-y divide-border">
          {/* Registered Users */}
          {registeredContacts.map((approval: UserApprovalInfo, idx: number) => {
            const principalStr = approval.principal.toString();
            const contactRequests = allRequests.filter(
              (r) => r.client.toString() === principalStr,
            );
            const isExpanded = expandedContact === principalStr;
            const ocidIdx = idx + 1;

            return (
              <ContactRow
                key={`reg-${principalStr}`}
                principalStr={principalStr}
                approval={approval}
                requests={contactRequests}
                isExpanded={isExpanded}
                onToggle={() =>
                  setExpandedContact(isExpanded ? null : principalStr)
                }
                searchQuery={searchQuery}
                ocidIdx={ocidIdx}
              />
            );
          })}
          {/* Lead contacts */}
          {leadsToShow.map((lead: Lead, idx: number) => {
            const leadKey = `lead-${String(lead.id)}`;
            const isExpanded = expandedContact === leadKey;
            const ocidIdx = registeredContacts.length + idx + 1;

            return (
              <LeadContactRow
                key={leadKey}
                lead={lead}
                isExpanded={isExpanded}
                onToggle={() => setExpandedContact(isExpanded ? null : leadKey)}
                searchQuery={searchQuery}
                ocidIdx={ocidIdx}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

function ContactRow({
  principalStr,
  approval,
  requests,
  isExpanded,
  onToggle,
  searchQuery,
  ocidIdx,
}: {
  principalStr: string;
  approval: UserApprovalInfo;
  requests: ServiceRequest[];
  isExpanded: boolean;
  onToggle: () => void;
  searchQuery: string;
  ocidIdx: number;
}) {
  const { data: profile } = useGetUserProfileByPrincipal(principalStr);

  // Filter by search query
  const name = profile?.name ?? "";
  const company = profile?.company ?? "";
  const matchesSearch =
    searchQuery === "" ||
    name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    principalStr.toLowerCase().includes(searchQuery.toLowerCase());

  if (!matchesSearch) return null;

  return (
    <div data-ocid={`contacts.item.${ocidIdx}`}>
      {/* Contact header row */}
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted/30 transition-colors text-left"
        onClick={onToggle}
        data-ocid="contacts.row"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-primary" />
          </div>
          <div className="min-w-0">
            {profile ? (
              <>
                <div className="font-medium text-sm text-foreground">
                  {profile.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {profile.company}
                </div>
                <div className="text-xs text-muted-foreground">
                  {profile.email}
                </div>
              </>
            ) : (
              <div className="font-mono text-xs text-muted-foreground truncate max-w-[200px]">
                {principalStr}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-muted-foreground">
            {requests.length} request{requests.length !== 1 ? "s" : ""}
          </span>
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-700 text-xs font-semibold">
            Registered
          </Badge>
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${approvalStatusColor(approval.status)}`}
          >
            {approvalStatusLabel(approval.status)}
          </span>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {/* Expanded request detail */}
      {isExpanded && (
        <div className="px-4 pb-4 bg-muted/20">
          <div className="pl-12">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3 mt-1">
              Contract / Service Requests
            </div>
            {requests.length === 0 ? (
              <p
                className="text-sm text-muted-foreground italic"
                data-ocid="contacts.requests.empty_state"
              >
                No service requests found for this contact.
              </p>
            ) : (
              <div className="rounded-md border border-border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40">
                      <TableHead className="text-xs font-semibold">
                        Service Type
                      </TableHead>
                      <TableHead className="text-xs font-semibold">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-semibold">
                        Created
                      </TableHead>
                      <TableHead className="text-xs font-semibold">
                        Description
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requests.map((req) => (
                      <TableRow
                        key={String(req.id)}
                        className="hover:bg-muted/20"
                      >
                        <TableCell className="text-xs">
                          {serviceTypeLabel(String(req.serviceType))}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${statusColor(req.status)}`}
                          >
                            {statusLabel(req.status)}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(
                            Number(req.createdAt) / 1_000_000,
                          ).toLocaleDateString("en-IN", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </TableCell>
                        <TableCell className="max-w-[200px]">
                          <span className="truncate block text-xs text-muted-foreground">
                            {req.description || "—"}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Lead Contact Row ────────────────────────────────────────────────────────

function LeadContactRow({
  lead,
  isExpanded,
  onToggle,
  searchQuery,
  ocidIdx,
}: {
  lead: Lead;
  isExpanded: boolean;
  onToggle: () => void;
  searchQuery: string;
  ocidIdx: number;
}) {
  // Filter by search query
  const matchesSearch =
    searchQuery === "" ||
    lead.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lead.phoneNumber.toLowerCase().includes(searchQuery.toLowerCase());

  if (!matchesSearch) return null;

  return (
    <div data-ocid={`contacts.item.${ocidIdx}`}>
      <button
        type="button"
        className="w-full flex items-center justify-between px-4 py-4 hover:bg-muted/30 transition-colors text-left"
        onClick={onToggle}
        data-ocid="contacts.row"
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-amber-500/10 flex items-center justify-center shrink-0">
            <Users className="h-4 w-4 text-amber-600 dark:text-amber-400" />
          </div>
          <div className="min-w-0">
            <div className="font-medium text-sm text-foreground">
              {lead.fullName}
            </div>
            {lead.businessName && (
              <div className="text-xs text-muted-foreground">
                {lead.businessName}
              </div>
            )}
            {lead.phoneNumber && (
              <div className="text-xs text-muted-foreground flex items-center gap-1">
                <Phone className="h-2.5 w-2.5" />
                {lead.phoneNumber}
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {new Date(Number(lead.createdAt) / 1_000_000).toLocaleDateString(
              "en-IN",
              {
                year: "numeric",
                month: "short",
                day: "numeric",
              },
            )}
          </span>
          <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300 border border-amber-200 dark:border-amber-700 text-xs font-semibold">
            Lead
          </Badge>
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>

      {isExpanded && (
        <div className="px-4 pb-4 bg-muted/20">
          <div className="pl-12 space-y-2">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2 mt-1">
              Lead Details
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Full Name
                </span>
                <p className="text-foreground font-medium">{lead.fullName}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Business
                </span>
                <p className="text-foreground font-medium">
                  {lead.businessName || "—"}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Phone
                </span>
                <p className="text-foreground font-medium">
                  {lead.phoneNumber || "—"}
                </p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground uppercase tracking-wide">
                  Submitted
                </span>
                <p className="text-foreground font-medium">
                  {new Date(
                    Number(lead.createdAt) / 1_000_000,
                  ).toLocaleDateString("en-IN", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function AdminDashboardPage() {
  // Fetch approvals at the page level for badge count (shared with ApprovalsTab poll)
  const { data: topLevelApprovals = [] } = useListApprovals({
    refetchInterval: 30000,
  });
  const pendingCount = topLevelApprovals.filter(
    (a: UserApprovalInfo) => String(a.status) === "pending",
  ).length;

  return (
    <AdminGuard>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage clients, requests, documents, and approvals.
          </p>
        </div>

        <Tabs defaultValue="approvals" className="space-y-6">
          <TabsList className="flex flex-wrap gap-1 h-auto p-1">
            <TabsTrigger
              value="approvals"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
              data-ocid="admin.approvals.tab"
            >
              <UserCheck className="h-4 w-4" />
              <span>User Approvals</span>
              {pendingCount > 0 && (
                <span className="ml-1 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold leading-none">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="contacts"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
              data-ocid="admin.contacts.tab"
            >
              <Users className="h-4 w-4" />
              <span>Contacts</span>
            </TabsTrigger>
            <TabsTrigger
              value="requests"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
              data-ocid="admin.requests.tab"
            >
              <ClipboardList className="h-4 w-4" />
              <span>Requests</span>
            </TabsTrigger>
            <TabsTrigger
              value="documents"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
              data-ocid="admin.documents.tab"
            >
              <FileText className="h-4 w-4" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger
              value="deliverables"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
              data-ocid="admin.deliverables.tab"
            >
              <Package className="h-4 w-4" />
              <span>Deliverables</span>
            </TabsTrigger>
            <TabsTrigger
              value="client-deliverables"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
              data-ocid="admin.client-deliverables.tab"
            >
              <Users className="h-4 w-4" />
              <span>Client Submissions</span>
            </TabsTrigger>
            <TabsTrigger
              value="payments"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
              data-ocid="admin.payments.tab"
            >
              <BarChart2 className="h-4 w-4" />
              <span>Payments</span>
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
              data-ocid="admin.analytics.tab"
            >
              <BarChart2 className="h-4 w-4" />
              <span>Analytics</span>
            </TabsTrigger>
            <TabsTrigger
              value="settings"
              className="flex items-center gap-1.5 text-xs sm:text-sm"
              data-ocid="admin.settings.tab"
            >
              <Settings className="h-4 w-4" />
              <span>Settings</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approvals">
            <ApprovalsTab />
          </TabsContent>

          <TabsContent value="contacts">
            <ContactsTab />
          </TabsContent>

          <TabsContent value="requests">
            <RequestsTab />
          </TabsContent>

          <TabsContent value="documents">
            <DocumentsTab />
          </TabsContent>

          <TabsContent value="deliverables">
            <DeliverablesTab />
          </TabsContent>

          <TabsContent value="client-deliverables">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">
                Client Submitted Deliverables
              </h3>
              <AdminClientDeliverableTable />
            </div>
          </TabsContent>

          <TabsContent value="payments">
            <div className="space-y-6">
              <AdminPaymentTable />
            </div>
          </TabsContent>

          <TabsContent value="analytics">
            <AnalyticsDashboard />
          </TabsContent>

          <TabsContent value="settings">
            <div className="space-y-6">
              <AdminPaymentSettings />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AdminGuard>
  );
}
