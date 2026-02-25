import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetAllRequests, useUpdateRequestStatus } from '../hooks/useServiceRequests';
import { useGetAllDocuments } from '../hooks/useDocuments';
import { useListApprovals, useSetApproval } from '../hooks/useApprovals';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { RequestStatus, ServiceType, DocumentType, ApprovalStatus, UserApprovalInfo, UserProfile } from '../backend';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CheckCircle, XCircle, Download, FileText, Users, ClipboardList, AlertCircle, Loader2, CreditCard, Mail, KeyRound } from 'lucide-react';
import AdminGuard from '../components/AdminGuard';
import AdminPaymentTable from '../components/AdminPaymentTable';
import AdminPaymentSettings from '../components/AdminPaymentSettings';
import { Principal } from '@dfinity/principal';

function formatDate(time: bigint) {
  return new Date(Number(time) / 1_000_000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric'
  });
}

function serviceTypeLabel(st: ServiceType) {
  const map: Record<string, string> = {
    incomeTaxFiling: 'Income Tax Filing',
    corporateTaxFiling: 'Corporate Tax Filing',
    audits: 'Audit Services',
    payrollAdmin: 'Payroll Administration',
    ledgerMaintenance: 'Ledger Maintenance',
    bankReconciliation: 'Bank Reconciliation',
  };
  return map[st] ?? st;
}

function docTypeLabel(dt: DocumentType) {
  const map: Record<string, string> = {
    taxFiling: 'Tax Filing',
    payrollReport: 'Payroll Report',
    auditDoc: 'Audit Document',
  };
  return map[dt] ?? dt;
}

function statusLabel(s: RequestStatus) {
  const map: Record<string, string> = {
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return map[s] ?? s;
}

function ApprovalStatusBadge({ status }: { status: ApprovalStatus }) {
  if (status === ApprovalStatus.approved) {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">Approved</span>;
  }
  if (status === ApprovalStatus.rejected) {
    return <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-800 border border-red-200">Rejected</span>;
  }
  return <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">Awaiting Review</span>;
}

function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    inProgress: 'bg-blue-50 text-blue-800 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold border ${styles[status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {statusLabel(status)}
    </span>
  );
}

// Sub-component that fetches and displays login details for a single approval entry
function ClientLoginDetails({ principal }: { principal: Principal }) {
  const { data: profile, isLoading } = useGetUserProfileByPrincipal(principal);
  const principalStr = principal.toString();

  return (
    <div className="space-y-1.5">
      {/* Principal ID */}
      <div className="flex items-start gap-1.5">
        <KeyRound className="h-3 w-3 text-muted-foreground mt-0.5 flex-shrink-0" />
        <div>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium leading-none mb-0.5">Principal ID</p>
          <p className="font-mono text-xs text-foreground break-all leading-snug">{principalStr}</p>
        </div>
      </div>

      {/* Name & Email */}
      {isLoading ? (
        <div className="flex items-center gap-1.5">
          <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <Skeleton className="h-3 w-32" />
        </div>
      ) : profile ? (
        <div className="space-y-1">
          {profile.name && (
            <div className="flex items-center gap-1.5">
              <Users className="h-3 w-3 text-muted-foreground flex-shrink-0" />
              <p className="text-xs text-foreground font-medium">{profile.name}</p>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
            <p className="text-xs text-muted-foreground">
              {profile.email || <span className="italic">No email on record</span>}
            </p>
          </div>
          {profile.company && (
            <p className="text-xs text-muted-foreground pl-4">{profile.company}</p>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <Mail className="h-3 w-3 text-muted-foreground flex-shrink-0" />
          <p className="text-xs text-muted-foreground italic">No profile on record</p>
        </div>
      )}
    </div>
  );
}

function ClientApprovalRow({ info, onApprove, onReject, isLoading }: {
  info: UserApprovalInfo;
  onApprove: () => void;
  onReject: () => void;
  isLoading: boolean;
}) {
  return (
    <TableRow className="border-b border-border hover:bg-muted/30 transition-colors align-top">
      <TableCell className="py-4 px-4">
        <ClientLoginDetails principal={info.principal} />
      </TableCell>
      <TableCell className="py-4 px-4">
        <ApprovalStatusBadge status={info.status} />
      </TableCell>
      <TableCell className="py-4 px-4">
        {info.status === ApprovalStatus.pending && (
          <div className="flex gap-2">
            <Button
              size="sm"
              onClick={onApprove}
              disabled={isLoading}
              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-7 px-3"
            >
              {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <CheckCircle className="h-3 w-3 mr-1" />}
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onReject}
              disabled={isLoading}
              className="border-red-300 text-red-700 hover:bg-red-50 text-xs h-7 px-3"
            >
              {isLoading ? <Loader2 className="h-3 w-3 animate-spin" /> : <XCircle className="h-3 w-3 mr-1" />}
              Reject
            </Button>
          </div>
        )}
        {info.status !== ApprovalStatus.pending && (
          <span className="text-xs text-muted-foreground italic">No action required</span>
        )}
      </TableCell>
    </TableRow>
  );
}

function AdminDashboardContent() {
  const { data: requests, isLoading: requestsLoading } = useGetAllRequests();
  const { data: documents, isLoading: docsLoading } = useGetAllDocuments();
  const { data: approvals, isLoading: approvalsLoading } = useListApprovals();
  const updateStatus = useUpdateRequestStatus();
  const setApproval = useSetApproval();
  const [pendingApprovalId, setPendingApprovalId] = useState<string | null>(null);

  const handleApprove = (principal: Principal) => {
    const key = principal.toString();
    setPendingApprovalId(key);
    setApproval.mutate(
      { user: principal, status: ApprovalStatus.approved },
      { onSettled: () => setPendingApprovalId(null) }
    );
  };

  const handleReject = (principal: Principal) => {
    const key = principal.toString();
    setPendingApprovalId(key);
    setApproval.mutate(
      { user: principal, status: ApprovalStatus.rejected },
      { onSettled: () => setPendingApprovalId(null) }
    );
  };

  const pendingCount = approvals?.filter(a => a.status === ApprovalStatus.pending).length ?? 0;

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-primary py-8 px-6 border-b border-white/10">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-serif font-bold tracking-wide text-white">Administration Dashboard</h1>
          <p className="text-white/70 text-sm mt-1">Client management, service engagements, document ledger, and payments</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="border border-border shadow-sm">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Pending Approvals</p>
                  <p className="text-2xl font-bold text-foreground">{pendingCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-sm">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <ClipboardList className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Service Engagements</p>
                  <p className="text-2xl font-bold text-foreground">{requests?.length ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-border shadow-sm">
            <CardContent className="pt-5 pb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wider font-medium">Client Documents</p>
                  <p className="text-2xl font-bold text-foreground">{documents?.length ?? 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabbed Sections */}
        <Tabs defaultValue="approvals" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="approvals" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <Users className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Approvals</span>
              <span className="sm:hidden">Approvals</span>
              {pendingCount > 0 && (
                <span className="ml-1 bg-amber-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {pendingCount}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="engagements" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <ClipboardList className="h-3.5 w-3.5" />
              <span>Engagements</span>
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <FileText className="h-3.5 w-3.5" />
              <span>Documents</span>
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-1.5 text-xs sm:text-sm">
              <CreditCard className="h-3.5 w-3.5" />
              <span>Payments</span>
            </TabsTrigger>
          </TabsList>

          {/* Client Approvals Tab */}
          <TabsContent value="approvals">
            <Card className="border border-border shadow-sm">
              <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-serif font-semibold text-foreground flex items-center gap-2">
                    <Users className="h-4 w-4 text-primary" />
                    Client Approvals
                  </CardTitle>
                  {pendingCount > 0 && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded">
                      <AlertCircle className="h-3 w-3" />
                      {pendingCount} awaiting review
                    </span>
                  )}
                </div>
              </CardHeader>
              <CardContent className="p-0">
                {approvalsLoading ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full" />)}
                  </div>
                ) : !approvals || approvals.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No client approval requests on record.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow className="border-b border-border bg-muted/20">
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Login Details</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Status</TableHead>
                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvals.map((info) => (
                        <ClientApprovalRow
                          key={info.principal.toString()}
                          info={info}
                          onApprove={() => handleApprove(info.principal)}
                          onReject={() => handleReject(info.principal)}
                          isLoading={pendingApprovalId === info.principal.toString()}
                        />
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Service Engagements Tab */}
          <TabsContent value="engagements">
            <Card className="border border-border shadow-sm">
              <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
                <CardTitle className="text-base font-serif font-semibold text-foreground flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  Service Engagements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {requestsLoading ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : !requests || requests.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No service engagements on record.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border bg-muted/20">
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Ref #</TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Client</TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Service Type</TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Engagement Date</TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Deadline</TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Status</TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Update Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((req, idx) => (
                          <TableRow key={req.id.toString()} className={`border-b border-border hover:bg-muted/20 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                            <TableCell className="py-3 px-4 text-xs font-mono text-muted-foreground">#{req.id.toString().padStart(4, '0')}</TableCell>
                            <TableCell className="py-3 px-4">
                              <div>
                                {req.name ? (
                                  <p className="text-sm font-medium text-foreground">{req.name}</p>
                                ) : (
                                  <p className="text-xs font-mono text-muted-foreground">{req.client.toString().slice(0, 12)}...</p>
                                )}
                                {req.company && <p className="text-xs text-muted-foreground">{req.company}</p>}
                                {req.email && <p className="text-xs text-muted-foreground">{req.email}</p>}
                              </div>
                            </TableCell>
                            <TableCell className="py-3 px-4 text-sm text-foreground">{serviceTypeLabel(req.serviceType)}</TableCell>
                            <TableCell className="py-3 px-4 text-sm text-muted-foreground">{formatDate(req.createdAt)}</TableCell>
                            <TableCell className="py-3 px-4 text-sm text-muted-foreground">{formatDate(req.deadline)}</TableCell>
                            <TableCell className="py-3 px-4"><RequestStatusBadge status={req.status} /></TableCell>
                            <TableCell className="py-3 px-4">
                              <Select
                                value={req.status}
                                onValueChange={(val) => updateStatus.mutate({ requestId: req.id, status: val as RequestStatus })}
                              >
                                <SelectTrigger className="h-7 text-xs w-36 border-border">
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
              </CardContent>
            </Card>
          </TabsContent>

          {/* Documents Tab */}
          <TabsContent value="documents">
            <Card className="border border-border shadow-sm">
              <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
                <CardTitle className="text-base font-serif font-semibold text-foreground flex items-center gap-2">
                  <FileText className="h-4 w-4 text-primary" />
                  Client Documents
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {docsLoading ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : !documents || documents.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    No documents on record.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border bg-muted/20">
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Document Name</TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Type</TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Client</TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Uploaded</TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Download</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {documents.map((doc, idx) => (
                          <TableRow key={doc.id.toString()} className={`border-b border-border hover:bg-muted/20 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                            <TableCell className="py-3 px-4 text-sm font-medium text-foreground">{doc.name}</TableCell>
                            <TableCell className="py-3 px-4">
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                                {docTypeLabel(doc.docType)}
                              </span>
                            </TableCell>
                            <TableCell className="py-3 px-4 font-mono text-xs text-muted-foreground">
                              {doc.client.toString().slice(0, 12)}...
                            </TableCell>
                            <TableCell className="py-3 px-4 text-sm text-muted-foreground">{formatDate(doc.uploadedAt)}</TableCell>
                            <TableCell className="py-3 px-4">
                              <a
                                href={doc.file.getDirectURL()}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 text-xs text-primary hover:underline font-medium"
                              >
                                <Download className="h-3.5 w-3.5" />
                                Download
                              </a>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments">
            <div className="space-y-6">
              <AdminPaymentSettings />
              <AdminPaymentTable />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <AdminDashboardContent />
    </AdminGuard>
  );
}
