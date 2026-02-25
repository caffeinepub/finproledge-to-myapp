import React from 'react';
import { useGetMyClientDeliverables } from '../hooks/useClientDeliverables';
import { ClientDeliverableStatus } from '../backend';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PackageOpen, Clock } from 'lucide-react';

function formatDate(time: bigint) {
  return new Date(Number(time) / 1_000_000).toLocaleDateString('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
  });
}

function DeliverableStatusBadge({ status }: { status: ClientDeliverableStatus }) {
  if (status === ClientDeliverableStatus.accepted) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
        Accepted
      </span>
    );
  }
  if (status === ClientDeliverableStatus.rejected) {
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-800 border border-red-200">
        Rejected
      </span>
    );
  }
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200">
      Pending Review
    </span>
  );
}

export default function ClientDeliverableTable() {
  const { data: deliverables, isLoading } = useGetMyClientDeliverables();

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
        <CardTitle className="text-base font-serif font-semibold text-foreground flex items-center gap-2">
          <PackageOpen className="h-4 w-4 text-primary" />
          My Submitted Deliverables
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : !deliverables || deliverables.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            <Clock className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            No deliverables submitted yet. Use the form above to submit your first deliverable.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/20">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Title</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Description</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Submitted</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliverables.map((item, idx) => (
                  <TableRow
                    key={item.id.toString()}
                    className={`border-b border-border hover:bg-muted/20 transition-colors ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}
                  >
                    <TableCell className="py-3 px-4 text-sm font-medium text-foreground max-w-[200px]">
                      <p className="truncate" title={item.title}>{item.title}</p>
                    </TableCell>
                    <TableCell className="py-3 px-4 text-sm text-muted-foreground max-w-[260px]">
                      {item.description ? (
                        <p className="truncate" title={item.description}>{item.description}</p>
                      ) : (
                        <span className="italic text-xs">No description</span>
                      )}
                    </TableCell>
                    <TableCell className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {formatDate(item.createdAt)}
                    </TableCell>
                    <TableCell className="py-3 px-4">
                      <DeliverableStatusBadge status={item.status} />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
