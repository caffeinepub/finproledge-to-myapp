import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetMyClientDeliverables, useUpdateClientDeliverableStatus } from '../hooks/useClientDeliverables';
import { ClientDeliverableStatus } from '../backend';
import { toast } from 'sonner';

function StatusBadge({ status }: { status: ClientDeliverableStatus }) {
  const map: Record<string, { label: string; className: string }> = {
    [ClientDeliverableStatus.pending]: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    [ClientDeliverableStatus.accepted]: { label: 'Accepted', className: 'bg-green-100 text-green-700 border-green-200' },
    [ClientDeliverableStatus.rejected]: { label: 'Rejected', className: 'bg-red-100 text-red-700 border-red-200' },
  };
  const config = map[status as string] ?? { label: String(status), className: '' };
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

export default function ClientDeliverableTable() {
  const { data: deliverables, isLoading } = useGetMyClientDeliverables();
  const updateStatus = useUpdateClientDeliverableStatus();

  const handleStatusChange = async (id: bigint, newStatus: ClientDeliverableStatus) => {
    try {
      await updateStatus.mutateAsync({ deliverableId: id, newStatus });
      toast.success(`Deliverable ${newStatus === ClientDeliverableStatus.accepted ? 'approved' : 'rejected'}`);
    } catch {
      toast.error('Failed to update status');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
      </div>
    );
  }

  if (!deliverables || deliverables.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground text-sm">
        No deliverables submitted yet.
      </div>
    );
  }

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Submitted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliverables.map((d) => (
            <TableRow key={String(d.id)}>
              <TableCell className="font-medium">{d.title}</TableCell>
              <TableCell className="text-muted-foreground text-sm max-w-xs truncate">{d.description}</TableCell>
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
                    {updateStatus.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Approve'}
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
  );
}
