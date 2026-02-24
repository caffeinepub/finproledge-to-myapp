import React, { useState, useRef } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetMyRequests } from '../hooks/useServiceRequests';
import { useUploadDocument } from '../hooks/useDocuments';
import { useIsCallerApproved, useRequestApproval } from '../hooks/useApprovals';
import { RequestStatus, ServiceType, DocumentType, UploadDocumentResult } from '../backend';
import { ExternalBlob } from '../backend';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload, Lock, ClipboardList, FileText, CheckCircle, AlertCircle, Loader2, Clock, CreditCard } from 'lucide-react';
import PaymentForm from '../components/PaymentForm';
import PaymentHistoryTable from '../components/PaymentHistoryTable';

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

function RequestStatusBadge({ status }: { status: RequestStatus }) {
  const styles: Record<string, string> = {
    pending: 'bg-amber-50 text-amber-800 border-amber-200',
    inProgress: 'bg-blue-50 text-blue-800 border-blue-200',
    completed: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
  };
  const labels: Record<string, string> = {
    pending: 'Pending',
    inProgress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold border ${styles[status] ?? 'bg-gray-100 text-gray-600 border-gray-200'}`}>
      {labels[status] ?? status}
    </span>
  );
}

function DocumentUploadSection({ isApproved }: { isApproved: boolean }) {
  const uploadDocument = useUploadDocument();
  const [docName, setDocName] = useState('');
  const [docType, setDocType] = useState<DocumentType | ''>('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !docName.trim() || !docType) return;
    setUploadError(null);
    setUploadSuccess(false);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes);

      const result = await uploadDocument.mutateAsync({
        docType: docType as DocumentType,
        name: docName.trim(),
        file: blob,
      });

      if ((result as UploadDocumentResult).__kind__ === 'notApproved') {
        setUploadError('Your account has not been approved for document submission. Please await administrator approval.');
      } else {
        setUploadSuccess(true);
        setDocName('');
        setDocType('');
        setFile(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (err: any) {
      setUploadError(err?.message ?? 'An error occurred during document submission.');
    }
  };

  if (!isApproved) {
    return (
      <Card className="border border-border shadow-sm">
        <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
          <CardTitle className="text-base font-serif font-semibold text-foreground flex items-center gap-2">
            <Upload className="h-4 w-4 text-primary" />
            Document Submission
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-border rounded-lg bg-muted/20">
            <Lock className="h-10 w-10 text-muted-foreground mb-3" />
            <h3 className="text-sm font-semibold text-foreground mb-1">Awaiting Administrator Approval</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Document submission is not yet available. Your account is pending review by our administration team. You will be notified once access has been granted.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
        <CardTitle className="text-base font-serif font-semibold text-foreground flex items-center gap-2">
          <Upload className="h-4 w-4 text-primary" />
          Document Submission
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {uploadSuccess && (
          <Alert className="mb-4 border-emerald-200 bg-emerald-50">
            <CheckCircle className="h-4 w-4 text-emerald-700" />
            <AlertDescription className="text-emerald-800 text-sm">
              Document submitted successfully to the client ledger.
            </AlertDescription>
          </Alert>
        )}
        {uploadError && (
          <Alert className="mb-4 border-red-200 bg-red-50" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-sm">{uploadError}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="docName" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Document Name</Label>
              <Input
                id="docName"
                value={docName}
                onChange={e => setDocName(e.target.value)}
                placeholder="e.g. Q3 2025 Tax Return"
                className="border-border text-sm"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="docType" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Document Classification</Label>
              <Select value={docType} onValueChange={val => setDocType(val as DocumentType)} required>
                <SelectTrigger className="border-border text-sm">
                  <SelectValue placeholder="Select classification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="taxFiling">Tax Filing</SelectItem>
                  <SelectItem value="payrollReport">Payroll Report</SelectItem>
                  <SelectItem value="auditDoc">Audit Document</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="fileUpload" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Select File</Label>
            <Input
              id="fileUpload"
              type="file"
              ref={fileInputRef}
              onChange={e => setFile(e.target.files?.[0] ?? null)}
              className="border-border text-sm cursor-pointer"
              required
            />
          </div>
          <Button
            type="submit"
            disabled={uploadDocument.isPending || !docName.trim() || !docType || !file}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            {uploadDocument.isPending ? (
              <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Submitting…</>
            ) : (
              <><Upload className="h-4 w-4 mr-2" />Submit Document</>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ClientPortalPage() {
  const { identity } = useInternetIdentity();
  const { data: requests, isLoading: requestsLoading } = useGetMyRequests();
  const { data: isApproved, isLoading: approvalLoading } = useIsCallerApproved();
  const requestApproval = useRequestApproval();
  const [approvalRequested, setApprovalRequested] = useState(false);

  if (!identity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="max-w-md w-full mx-4 border border-border shadow-sm">
          <CardContent className="p-8 text-center">
            <Lock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <h2 className="text-lg font-serif font-semibold text-foreground mb-2">Authentication Required</h2>
            <p className="text-sm text-muted-foreground">Please log in to access your client portal.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleRequestApproval = async () => {
    await requestApproval.mutateAsync();
    setApprovalRequested(true);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Page Header */}
      <div className="bg-primary py-8 px-6 border-b border-white/10">
        <div className="max-w-5xl mx-auto">
          <h1 className="text-2xl font-serif font-bold tracking-wide text-white">Client Portal</h1>
          <p className="text-white/70 text-sm mt-1">Your service engagements, documents, and payments</p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Approval Status Banner */}
        {!approvalLoading && isApproved === false && (
          <Alert className="border-amber-200 bg-amber-50">
            <Clock className="h-4 w-4 text-amber-700" />
            <AlertDescription className="text-amber-800 text-sm flex items-center justify-between flex-wrap gap-2">
              <span>
                <strong>Account Pending Approval</strong> — Your account is awaiting administrator review. Document submission will be enabled upon approval.
              </span>
              {!approvalRequested ? (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleRequestApproval}
                  disabled={requestApproval.isPending}
                  className="border-amber-400 text-amber-800 hover:bg-amber-100 text-xs h-7"
                >
                  {requestApproval.isPending ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                  Request Access
                </Button>
              ) : (
                <span className="text-xs font-medium text-amber-700 italic">Access request submitted.</span>
              )}
            </AlertDescription>
          </Alert>
        )}

        {isApproved === true && (
          <Alert className="border-emerald-200 bg-emerald-50">
            <CheckCircle className="h-4 w-4 text-emerald-700" />
            <AlertDescription className="text-emerald-800 text-sm">
              <strong>Account Approved</strong> — You have full access to document submission and all client services.
            </AlertDescription>
          </Alert>
        )}

        {/* Tabbed Content */}
        <Tabs defaultValue="engagements" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
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

          {/* Service Engagements Tab */}
          <TabsContent value="engagements">
            <Card className="border border-border shadow-sm">
              <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
                <CardTitle className="text-base font-serif font-semibold text-foreground flex items-center gap-2">
                  <ClipboardList className="h-4 w-4 text-primary" />
                  My Service Engagements
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {requestsLoading ? (
                  <div className="p-6 space-y-3">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
                  </div>
                ) : !requests || requests.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground text-sm">
                    <FileText className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
                    No service engagements on record. Submit a service request to get started.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="border-b border-border bg-muted/20">
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Ref #</TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Service Type</TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Engagement Date</TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Deadline</TableHead>
                          <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {requests.map((req, idx) => (
                          <TableRow key={req.id.toString()} className={`border-b border-border hover:bg-muted/20 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}>
                            <TableCell className="py-3 px-4 text-xs font-mono text-muted-foreground">#{req.id.toString().padStart(4, '0')}</TableCell>
                            <TableCell className="py-3 px-4 text-sm text-foreground">{serviceTypeLabel(req.serviceType)}</TableCell>
                            <TableCell className="py-3 px-4 text-sm text-muted-foreground">{formatDate(req.createdAt)}</TableCell>
                            <TableCell className="py-3 px-4 text-sm text-muted-foreground">{formatDate(req.deadline)}</TableCell>
                            <TableCell className="py-3 px-4"><RequestStatusBadge status={req.status} /></TableCell>
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
            {approvalLoading ? (
              <Card className="border border-border shadow-sm">
                <CardContent className="p-6">
                  <Skeleton className="h-32 w-full" />
                </CardContent>
              </Card>
            ) : (
              <DocumentUploadSection isApproved={isApproved ?? false} />
            )}
          </TabsContent>

          {/* Payments Tab */}
          <TabsContent value="payments" className="space-y-6">
            <PaymentForm />
            <PaymentHistoryTable />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
