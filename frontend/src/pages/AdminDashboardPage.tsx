import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdminGuard from '../components/AdminGuard';
import { useGetAllRequests, useUpdateRequestStatus } from '../hooks/useServiceRequests';
import { useGetAllDocuments } from '../hooks/useDocuments';
import { useGetAllComplianceDeliverables, useCreateDeliverable } from '../hooks/useDeliverables';
import { useListApprovals, useSetApproval } from '../hooks/useApprovals';
import AdminClientDeliverableTable from '../components/AdminClientDeliverableTable';
import AdminPaymentTable from '../components/AdminPaymentTable';
import AdminPaymentSettings from '../components/AdminPaymentSettings';
import AnalyticsDashboard from '../components/AnalyticsDashboard';
import DocumentTable from '../components/DocumentTable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import { ApprovalStatus, RequestStatus, DeliverableType } from '../backend';
import { Principal } from '@dfinity/principal';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { Plus, Users, FileText, CreditCard, BarChart3, CheckSquare, Shield } from 'lucide-react';
import ComplianceAdminToDoList from '../components/ComplianceAdminToDoList';
import ComplianceAdminTimeline from '../components/ComplianceAdminTimeline';
import ComplianceAdminFollowUp from '../components/ComplianceAdminFollowUp';
import CreateToDoForm from '../components/CreateToDoForm';
import CreateTimelineForm from '../components/CreateTimelineForm';
import CreateFollowUpForm from '../components/CreateFollowUpForm';

const serviceTypeLabels: Record<string, string> = {
  incomeTaxFiling: 'Income Tax Filing',
  corporateTaxFiling: 'Corporate Tax Filing',
  audits: 'Audits',
  payrollAdmin: 'Payroll Admin',
  ledgerMaintenance: 'Ledger Maintenance',
  bankReconciliation: 'Bank Reconciliation',
  gstFiling: 'GST Filing',
  tdsFiling: 'TDS Filing',
  financialManagement: 'Financial Management',
  accountingServices: 'Accounting Services',
  loanFinancing: 'Loan Financing',
  other: 'Other',
};

const requestStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  inProgress: 'bg-blue-100 text-blue-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

// useGetUserProfileByPrincipal expects a string principal
function ClientName({ principalStr }: { principalStr: string }) {
  const { data: profile } = useGetUserProfileByPrincipal(principalStr);
  return <span>{profile?.name || principalStr.slice(0, 12) + '...'}</span>;
}

function ApprovalsTab() {
  const { data: approvals = [], isLoading } = useListApprovals();
  const setApprovalMutation = useSetApproval();

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">User Approvals</h3>
      {approvals.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No approval requests yet.</p>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Principal</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {approvals.map((approval) => (
                <TableRow key={approval.principal.toString()}>
                  <TableCell className="font-mono text-sm">
                    {approval.principal.toString().slice(0, 20)}...
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        String(approval.status) === 'approved'
                          ? 'bg-green-100 text-green-800'
                          : String(approval.status) === 'rejected'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }
                    >
                      {String(approval.status)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-600 border-green-200 hover:bg-green-50"
                        onClick={() =>
                          setApprovalMutation.mutate({
                            user: approval.principal,
                            status: ApprovalStatus.approved,
                          })
                        }
                        disabled={setApprovalMutation.isPending}
                      >
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() =>
                          setApprovalMutation.mutate({
                            user: approval.principal,
                            status: ApprovalStatus.rejected,
                          })
                        }
                        disabled={setApprovalMutation.isPending}
                      >
                        Reject
                      </Button>
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

function EngagementsTab() {
  const { data: requests = [], isLoading } = useGetAllRequests();
  const updateStatusMutation = useUpdateRequestStatus();

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">All Service Requests</h3>
      {requests.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No service requests yet.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Service</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Update Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow key={String(request.id)}>
                  <TableCell className="text-sm">
                    {request.name || (
                      <ClientName principalStr={request.client.toString()} />
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {serviceTypeLabels[String(request.serviceType)] || String(request.serviceType)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-[200px] truncate">
                    {request.description}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={requestStatusColors[String(request.status)] || ''}
                    >
                      {String(request.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(Number(request.createdAt) / 1_000_000).toLocaleDateString('en-IN')}
                  </TableCell>
                  <TableCell>
                    <Select
                      value={String(request.status)}
                      onValueChange={(value) =>
                        updateStatusMutation.mutate({
                          requestId: request.id,
                          status: value as RequestStatus,
                        })
                      }
                    >
                      <SelectTrigger className="w-32 h-8 text-xs">
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

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">All Client Documents</h3>
      <DocumentTable documents={documents} isAdmin />
    </div>
  );
}

function DeliverablesTab() {
  const { data: deliverables = [], isLoading } = useGetAllComplianceDeliverables();
  const createDeliverableMutation = useCreateDeliverable();
  const { data: approvals = [] } = useListApprovals();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState({
    clientPrincipal: '',
    title: '',
    dueDate: '',
    deliverableType: 'consulting',
  });

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.clientPrincipal || !form.title || !form.dueDate) return;
    try {
      await createDeliverableMutation.mutateAsync({
        clientPrincipal: Principal.fromText(form.clientPrincipal),
        title: form.title,
        dueDate: BigInt(new Date(form.dueDate).getTime()) * BigInt(1_000_000),
        deliverableType: form.deliverableType as DeliverableType,
      });
      setDialogOpen(false);
      setForm({ clientPrincipal: '', title: '', dueDate: '', deliverableType: 'consulting' });
    } catch (error) {
      console.error('Failed to create deliverable:', error);
    }
  };

  if (isLoading) return <div className="py-8 text-center text-muted-foreground">Loading...</div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Compliance Deliverables</h3>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-gold hover:bg-gold/90 text-navy">
              <Plus className="h-4 w-4 mr-1" />
              Add Deliverable
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Deliverable</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Client</label>
                <Select
                  value={form.clientPrincipal}
                  onValueChange={(v) => setForm((f) => ({ ...f, clientPrincipal: v }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select client" />
                  </SelectTrigger>
                  <SelectContent>
                    {approvals.map((a) => (
                      <SelectItem key={a.principal.toString()} value={a.principal.toString()}>
                        {a.principal.toString().slice(0, 20)}...
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Title</label>
                <input
                  className="w-full border rounded px-3 py-2 text-sm bg-background text-foreground"
                  value={form.title}
                  onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Due Date</label>
                <input
                  type="date"
                  className="w-full border rounded px-3 py-2 text-sm bg-background text-foreground"
                  value={form.dueDate}
                  onChange={(e) => setForm((f) => ({ ...f, dueDate: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Type</label>
                <Select
                  value={form.deliverableType}
                  onValueChange={(v) => setForm((f) => ({ ...f, deliverableType: v }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consulting">Consulting</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="quarterly">Quarterly</SelectItem>
                    <SelectItem value="annual">Annual</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2 justify-end">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createDeliverableMutation.isPending}
                  className="bg-gold hover:bg-gold/90 text-navy"
                >
                  {createDeliverableMutation.isPending ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {deliverables.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No deliverables yet.</p>
      ) : (
        <div className="rounded-md border overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Due Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {deliverables.map((d) => (
                <TableRow key={String(d.id)}>
                  <TableCell className="text-sm">
                    <ClientName principalStr={d.client.toString()} />
                  </TableCell>
                  <TableCell className="font-medium text-sm">{d.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-xs">
                      {String(d.deliverableType)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="text-xs">
                      {String(d.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(Number(d.dueDate) / 1_000_000).toLocaleDateString('en-IN')}
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

function CompliancePortalTab() {
  const [activeSubTab, setActiveSubTab] = useState('todos');
  const [toDoDialogOpen, setToDoDialogOpen] = useState(false);
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-gold" />
        <h3 className="text-lg font-semibold">Compliance Portal</h3>
      </div>

      <Tabs value={activeSubTab} onValueChange={setActiveSubTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="todos">To-Do List</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="followup">Follow-Up</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="mt-4">
          <div className="flex justify-end mb-4">
            <Dialog open={toDoDialogOpen} onOpenChange={setToDoDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gold hover:bg-gold/90 text-navy">
                  <Plus className="h-4 w-4 mr-1" />
                  Add To-Do
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create To-Do</DialogTitle>
                </DialogHeader>
                <CreateToDoForm onSuccess={() => setToDoDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          <ComplianceAdminToDoList />
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <div className="flex justify-end mb-4">
            <Dialog open={timelineDialogOpen} onOpenChange={setTimelineDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gold hover:bg-gold/90 text-navy">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Timeline Entry
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Timeline Entry</DialogTitle>
                </DialogHeader>
                <CreateTimelineForm onSuccess={() => setTimelineDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          <ComplianceAdminTimeline />
        </TabsContent>

        <TabsContent value="followup" className="mt-4">
          <div className="flex justify-end mb-4">
            <Dialog open={followUpDialogOpen} onOpenChange={setFollowUpDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="bg-gold hover:bg-gold/90 text-navy">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Follow-Up
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-lg">
                <DialogHeader>
                  <DialogTitle>Create Follow-Up</DialogTitle>
                </DialogHeader>
                <CreateFollowUpForm onSuccess={() => setFollowUpDialogOpen(false)} />
              </DialogContent>
            </Dialog>
          </div>
          <ComplianceAdminFollowUp />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="bg-navy py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-white">
              Admin <span className="text-gold">Dashboard</span>
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Manage clients, documents, payments, and compliance
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="approvals">
            <TabsList className="flex flex-wrap gap-1 h-auto mb-6">
              <TabsTrigger value="approvals" className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                Approvals
              </TabsTrigger>
              <TabsTrigger value="engagements" className="flex items-center gap-1.5">
                <CheckSquare className="h-4 w-4" />
                Engagements
              </TabsTrigger>
              <TabsTrigger value="documents" className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="payments" className="flex items-center gap-1.5">
                <CreditCard className="h-4 w-4" />
                Payments
              </TabsTrigger>
              <TabsTrigger value="deliverables" className="flex items-center gap-1.5">
                <FileText className="h-4 w-4" />
                Deliverables
              </TabsTrigger>
              <TabsTrigger value="analytics" className="flex items-center gap-1.5">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="compliance" className="flex items-center gap-1.5">
                <Shield className="h-4 w-4" />
                Compliance Portal
              </TabsTrigger>
            </TabsList>

            <TabsContent value="approvals">
              <ApprovalsTab />
            </TabsContent>
            <TabsContent value="engagements">
              <EngagementsTab />
            </TabsContent>
            <TabsContent value="documents">
              <DocumentsTab />
            </TabsContent>
            <TabsContent value="payments">
              <div className="space-y-6">
                <AdminPaymentSettings />
                <AdminPaymentTable />
              </div>
            </TabsContent>
            <TabsContent value="deliverables">
              <div className="space-y-6">
                <DeliverablesTab />
                <AdminClientDeliverableTable />
              </div>
            </TabsContent>
            <TabsContent value="analytics">
              <AnalyticsDashboard />
            </TabsContent>
            <TabsContent value="compliance">
              <CompliancePortalTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  );
}
