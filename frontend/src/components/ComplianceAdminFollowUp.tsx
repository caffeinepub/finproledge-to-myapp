import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllFollowUps } from '../hooks/useComplianceAdmin';
import { FollowUpStatusSelect } from './TaskStatusSelect';
import CreateFollowUpForm from './CreateFollowUpForm';
import { FollowUpItem, FollowUpStatus } from '../backend';

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString();
}

export default function ComplianceAdminFollowUp() {
  const { data: followUps, isLoading } = useGetAllFollowUps();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Follow-Ups</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-navy text-white hover:bg-navy/90">
              <Plus className="w-4 h-4 mr-1" /> Add Follow-Up
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Follow-Up</DialogTitle>
            </DialogHeader>
            <CreateFollowUpForm onSuccess={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : !followUps || followUps.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No follow-up items yet. Create one to get started.
        </div>
      ) : (
        <div className="border border-border rounded-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {followUps.map((item: FollowUpItem) => (
                <TableRow key={String(item.id)}>
                  <TableCell className="font-medium">{item.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-xs truncate">{item.description}</TableCell>
                  <TableCell className="text-sm">{formatDate(item.dueDate)}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-xs truncate">{item.notes || '—'}</TableCell>
                  <TableCell>
                    <FollowUpStatusSelect
                      followUpId={item.id}
                      currentStatus={item.status as unknown as FollowUpStatus}
                    />
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
