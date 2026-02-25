import { useState } from 'react';
import { Loader2, Plus, ExternalLink, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useGetAllClientDeliverables, useUpdateClientDeliverableStatus, useSubmitDeliverableForClient } from '../hooks/useClientDeliverables';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { ClientDeliverableStatus, ClientDeliverable } from '../backend';
import { toast } from 'sonner';
import { Progress } from '@/components/ui/progress';

function StatusBadge({ status }: { status: ClientDeliverableStatus }) {
  const map: Record<string, { label: string; className: string }> = {
    [ClientDeliverableStatus.pending]: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    [ClientDeliverableStatus.accepted]: { label: 'Accepted', className: 'bg-green-100 text-green-700 border-green-200' },
    [ClientDeliverableStatus.rejected]: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-200' },
  };
  const config = map[status as string] ?? { label: String(status), className: '' };
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

function ClientNameCell({ principal }: { principal: string }) {
  const { data: profile } = useGetUserProfileByPrincipal(principal);
  return <span>{profile?.name ?? principal.slice(0, 12) + '...'}</span>;
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
        <Label htmlFor="clientPrincipal">Client Principal ID <span className="text-destructive">*</span></Label>
        <Input
          id="clientPrincipal"
          value={clientPrincipal}
          onChange={(e) => setClientPrincipal(e.target.value)}
          placeholder="aaaaa-bbbbb-ccccc-..."
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
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
        <Label htmlFor="file">File <span className="text-destructive">*</span></Label>
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
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...</>
        ) : (
          'Submit Deliverable'
        )}
      </Button>
    </form>
  );
}

export default function AdminClientDeliverableTable() {
  const { data: deliverables, isLoading } = useGetAllClientDeliverables();
  const updateStatus = useUpdateClientDeliverableStatus();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const handleStatusChange = async (id: bigint, newStatus: ClientDeliverableStatus) => {
    try {
      await updateStatus.mutateAsync({ deliverableId: id, newStatus });
      toast.success(`Deliverable ${newStatus === ClientDeliverableStatus.accepted ? 'accepted' : 'rejected'}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-foreground">Client Submitted Deliverables</h3>
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-navy text-white hover:bg-navy/90">
              <Plus className="w-4 h-4 mr-1" /> Add Deliverable
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Submit Deliverable for Client</DialogTitle>
            </DialogHeader>
            <AdminAddDeliverableForm onSuccess={() => setAddDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {!deliverables || deliverables.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No client deliverables submitted yet.
        </div>
      ) : (
        <div className="border border-border rounded-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Client</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Document</TableHead>
                <TableHead>Submitted</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(deliverables as ClientDeliverable[]).map((d) => (
                <TableRow key={String(d.id)}>
                  <TableCell className="text-sm">
                    <ClientNameCell principal={d.submitter.toString()} />
                  </TableCell>
                  <TableCell className="font-medium">{d.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-xs truncate">{d.description}</TableCell>
                  <TableCell>
                    <a
                      href={d.file.getDirectURL()}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="inline-flex items-center gap-1 text-navy hover:text-navy/70 text-sm font-medium"
                    >
                      <FileText className="w-4 h-4" />
                      View / Download
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(Number(d.createdAt) / 1_000_000).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={d.status as unknown as ClientDeliverableStatus} />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-green-700 border-green-300 hover:bg-green-50 h-7 text-xs"
                        disabled={updateStatus.isPending || (d.status as unknown as string) === ClientDeliverableStatus.accepted}
                        onClick={() => handleStatusChange(d.id, ClientDeliverableStatus.accepted)}
                      >
                        {updateStatus.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Accept'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-700 border-red-300 hover:bg-red-50 h-7 text-xs"
                        disabled={updateStatus.isPending || (d.status as unknown as string) === ClientDeliverableStatus.rejected}
                        onClick={() => handleStatusChange(d.id, ClientDeliverableStatus.rejected)}
                      >
                        {updateStatus.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Reject'}
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
