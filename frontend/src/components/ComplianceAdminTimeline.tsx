import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllTimelines } from '../hooks/useComplianceAdmin';
import { TimelineStatusSelect } from './TaskStatusSelect';
import CreateTimelineForm from './CreateTimelineForm';
import { TimelineEntry, TimelineStatus } from '../backend';

function TimelineStatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; className: string }> = {
    planned: { label: 'Planned', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    inProgress: { label: 'In Progress', className: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
    completed: { label: 'Completed', className: 'bg-green-100 text-green-700 border-green-200' },
  };
  const config = map[status] ?? { label: status, className: '' };
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

function formatDate(ts: bigint) {
  return new Date(Number(ts) / 1_000_000).toLocaleDateString();
}

export default function ComplianceAdminTimeline() {
  const { data: timelines, isLoading } = useGetAllTimelines();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Timeline</h2>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm" className="bg-navy text-white hover:bg-navy/90">
              <Plus className="w-4 h-4 mr-1" /> Add Timeline Entry
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Timeline Entry</DialogTitle>
            </DialogHeader>
            <CreateTimelineForm onSuccess={() => setDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-12 w-full" />)}
        </div>
      ) : !timelines || timelines.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          No timeline entries yet. Create one to get started.
        </div>
      ) : (
        <div className="border border-border rounded-sm overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timelines.map((entry: TimelineEntry) => (
                <TableRow key={String(entry.id)}>
                  <TableCell className="font-medium">{entry.title}</TableCell>
                  <TableCell className="text-muted-foreground text-sm max-w-xs truncate">{entry.description}</TableCell>
                  <TableCell className="text-sm">{formatDate(entry.startDate)}</TableCell>
                  <TableCell className="text-sm">{formatDate(entry.endDate)}</TableCell>
                  <TableCell>
                    <TimelineStatusSelect
                      timelineId={entry.id}
                      currentStatus={entry.status as unknown as TimelineStatus}
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
