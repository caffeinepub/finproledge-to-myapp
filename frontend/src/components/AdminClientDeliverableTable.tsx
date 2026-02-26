import React, { useState } from 'react';
import { useGetAllClientDeliverables, useUpdateClientDeliverableStatus, useSubmitDeliverableForClient } from '../hooks/useClientDeliverables';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { ClientDeliverable, ClientDeliverableStatus } from '../backend';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Progress } from '@/components/ui/progress';
import { Download, Plus, CheckCircle, XCircle, FileText, Loader2 } from 'lucide-react';
import DownloadOptionsMenu, { DownloadFile } from './DownloadOptionsMenu';
import { toast } from 'sonner';

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

function StatusBadge({ status }: { status: ClientDeliverableStatus }) {
  const map: Record<string, { label: string; className: string }> = {
    pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-800' },
    accepted: { label: 'Accepted', className: 'bg-green-100 text-green-800' },
    rejected: { label: 'Rejected', className: 'bg-red-100 text-red-800' },
  };
  const key = status as unknown as string;
  const info = map[key] ?? { label: key, className: 'bg-gray-100 text-gray-800' };
  return <Badge className={`text-xs border-0 ${info.className}`}>{info.label}</Badge>;
}

function ClientNameCell({ principal }: { principal: string }) {
  const { data: profile } = useGetUserProfileByPrincipal(principal);
  return (
    <span className="text-sm">
      {profile
        ? profile.name
        : <span className="font-mono text-xs text-muted-foreground">{principal.slice(0, 12)}…</span>}
    </span>
  );
}

function AdminAddDeliverableForm({ onSuccess }: { onSuccess: () => void }) {
  const [clientPrincipal, setClientPrincipal] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const submitForClient = useSubmitDeliverableForClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientPrincipal || !title || !file) return;
    try {
      const bytes = new Uint8Array(await file.arrayBuffer());
      await submitForClient.mutateAsync({
        clientPrincipal,
        title,
        description,
        file: bytes,
        onProgress: setUploadProgress,
      });
      toast.success('Deliverable submitted successfully');
      onSuccess();
    } catch {
      toast.error('Failed to submit deliverable');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="clientPrincipal">
          Client Principal ID <span className="text-destructive">*</span>
        </Label>
        <Input
          id="clientPrincipal"
          value={clientPrincipal}
          onChange={(e) => setClientPrincipal(e.target.value)}
          placeholder="aaaaa-bbbbb-ccccc-..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">
          Title <span className="text-destructive">*</span>
        </Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Deliverable title"
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Optional description..."
          rows={3}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="file">
          File <span className="text-destructive">*</span>
        </Label>
        <Input
          id="file"
          type="file"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          required
        />
      </div>
      {submitForClient.isPending && uploadProgress > 0 && (
        <div className="space-y-1">
          <div className="text-xs text-muted-foreground">Uploading... {uploadProgress}%</div>
          <Progress value={uploadProgress} className="h-2" />
        </div>
      )}
      <Button
        type="submit"
        className="w-full bg-navy text-white hover:bg-navy/90"
        disabled={submitForClient.isPending || !clientPrincipal || !title || !file}
      >
        {submitForClient.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
          </>
        ) : (
          'Submit Deliverable'
        )}
      </Button>
    </form>
  );
}

export default function AdminClientDeliverableTable() {
  const { data: deliverables = [], isLoading } = useGetAllClientDeliverables();
  const updateStatus = useUpdateClientDeliverableStatus();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  async function handleDownload(deliverable: ClientDeliverable) {
    const bytes = await deliverable.file.getBytes();
    const blob = new Blob([bytes], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = deliverable.title;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  function handleStatusUpdate(id: bigint, status: ClientDeliverableStatus) {
    updateStatus.mutate(
      { deliverableId: id, newStatus: status },
      {
        onSuccess: () =>
          toast.success(
            status === ClientDeliverableStatus.accepted ? 'Deliverable accepted' : 'Deliverable rejected'
          ),
        onError: () => toast.error('Failed to update status'),
      }
    );
  }

  // Build table rows for export
  const tableRows = (deliverables as ClientDeliverable[]).map((d) => ({
    ID: String(d.id),
    Title: d.title,
    Description: d.description,
    Status: d.status as unknown as string,
    'Submitted At': formatDate(d.createdAt),
    Submitter: d.submitter.toString(),
  }));

  // Build file list for ZIP/Image downloads
  const downloadFiles: DownloadFile[] = (deliverables as ClientDeliverable[]).map((d) => ({
    name: d.title,
    mimeType: 'application/octet-stream',
    getBytes: () => d.file.getBytes(),
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gold" />
          <h3 className="font-semibold text-foreground">
            Client Deliverables ({(deliverables as ClientDeliverable[]).length})
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <DownloadOptionsMenu
            tableData={tableRows}
            title="Client Deliverables"
            files={downloadFiles}
            availableFormats={['pdf', 'spreadsheet', 'document', 'csv', 'zip']}
          />
          <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" className="gap-2 bg-navy text-white hover:bg-navy/90">
                <Plus className="h-4 w-4" />
                Add Deliverable
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader>
                <DialogTitle>Submit Deliverable for Client</DialogTitle>
              </DialogHeader>
              <AdminAddDeliverableForm onSuccess={() => setAddDialogOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {(deliverables as ClientDeliverable[]).length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No deliverables submitted yet.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Title</TableHead>
                <TableHead className="font-semibold">Client</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="font-semibold">Submitted</TableHead>
                <TableHead className="font-semibold text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(deliverables as ClientDeliverable[]).map((deliverable) => (
                <TableRow key={String(deliverable.id)} className="hover:bg-muted/30">
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{deliverable.title}</p>
                      {deliverable.description && (
                        <p className="text-xs text-muted-foreground mt-0.5 max-w-[200px] truncate">
                          {deliverable.description}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ClientNameCell principal={deliverable.submitter.toString()} />
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={deliverable.status} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {formatDate(deliverable.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(deliverable)}
                        className="gap-1 text-gold hover:text-gold hover:bg-gold/10 h-8 px-2"
                        title="Download file"
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(deliverable.id, ClientDeliverableStatus.accepted)
                        }
                        disabled={
                          updateStatus.isPending ||
                          (deliverable.status as unknown as string) ===
                            ClientDeliverableStatus.accepted
                        }
                        className="gap-1 text-green-600 hover:text-green-700 hover:bg-green-50 h-8 px-2"
                        title="Accept"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(deliverable.id, ClientDeliverableStatus.rejected)
                        }
                        disabled={
                          updateStatus.isPending ||
                          (deliverable.status as unknown as string) ===
                            ClientDeliverableStatus.rejected
                        }
                        className="gap-1 text-red-600 hover:text-red-700 hover:bg-red-50 h-8 px-2"
                        title="Reject"
                      >
                        <XCircle className="h-3.5 w-3.5" />
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
