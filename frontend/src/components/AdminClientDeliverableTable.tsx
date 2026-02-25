import React, { useState } from 'react';
import { useGetAllClientDeliverables, useUpdateClientDeliverableStatus } from '../hooks/useClientDeliverables';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { ClientDeliverableStatus } from '../backend';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, XCircle, PackageOpen, Loader2 } from 'lucide-react';
import type { Principal } from '@icp-sdk/core/principal';

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

function ClientNameCell({ principal }: { principal: Principal }) {
  // Convert Principal to string for the hook
  const principalStr = principal.toString();
  const { data: profile, isLoading } = useGetUserProfileByPrincipal(principalStr);
  const truncated = principalStr.length > 20
    ? `${principalStr.slice(0, 10)}…${principalStr.slice(-8)}`
    : principalStr;

  if (isLoading) {
    return <Skeleton className="h-4 w-28" />;
  }

  return (
    <div>
      {profile?.name ? (
        <p className="text-sm font-medium text-foreground">{profile.name}</p>
      ) : null}
      {profile?.company ? (
        <p className="text-xs text-muted-foreground">{profile.company}</p>
      ) : null}
      <p className="text-xs font-mono text-muted-foreground" title={principalStr}>{truncated}</p>
    </div>
  );
}

export default function AdminClientDeliverableTable() {
  const { data: deliverables, isLoading, isError } = useGetAllClientDeliverables();
  const updateStatus = useUpdateClientDeliverableStatus();
  const [pendingId, setPendingId] = useState<string | null>(null);

  const handleAccept = (id: bigint) => {
    const key = id.toString();
    setPendingId(key);
    updateStatus.mutate(
      { deliverableId: id, newStatus: ClientDeliverableStatus.accepted },
      { onSettled: () => setPendingId(null) }
    );
  };

  const handleReject = (id: bigint) => {
    const key = id.toString();
    setPendingId(key);
    updateStatus.mutate(
      { deliverableId: id, newStatus: ClientDeliverableStatus.rejected },
      { onSettled: () => setPendingId(null) }
    );
  };

  return (
    <Card className="border border-border shadow-sm">
      <CardHeader className="border-b border-border bg-muted/30 px-6 py-4">
        <CardTitle className="text-base font-serif font-semibold text-foreground flex items-center gap-2">
          <PackageOpen className="h-4 w-4 text-primary" />
          Client Submitted Deliverables
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-10 w-full" />)}
          </div>
        ) : isError ? (
          <div className="p-8 text-center text-destructive text-sm">
            Failed to load deliverables. Please refresh and try again.
          </div>
        ) : !deliverables || deliverables.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground text-sm">
            <PackageOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground/50" />
            No client deliverables have been submitted yet.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-border bg-muted/20">
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Ref #</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Client</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Title</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Description</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Submitted</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Status</TableHead>
                  <TableHead className="text-xs font-semibold uppercase tracking-wider text-muted-foreground py-3 px-4">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {deliverables.map((item, idx) => {
                  const isThisPending = pendingId === item.id.toString();
                  return (
                    <TableRow
                      key={item.id.toString()}
                      className={`border-b border-border hover:bg-muted/20 transition-colors align-top ${idx % 2 === 0 ? '' : 'bg-muted/10'}`}
                    >
                      <TableCell className="py-3 px-4 text-xs font-mono text-muted-foreground">
                        #{item.id.toString().padStart(4, '0')}
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <ClientNameCell principal={item.submitter} />
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm font-medium text-foreground max-w-[180px]">
                        <p className="truncate" title={item.title}>{item.title}</p>
                      </TableCell>
                      <TableCell className="py-3 px-4 text-sm text-muted-foreground max-w-[220px]">
                        {item.description ? (
                          <p className="truncate" title={item.description}>{item.description}</p>
                        ) : (
                          <span className="italic text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 px-4 text-xs text-muted-foreground whitespace-nowrap">
                        {formatDate(item.createdAt)}
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        <DeliverableStatusBadge status={item.status} />
                      </TableCell>
                      <TableCell className="py-3 px-4">
                        {item.status === ClientDeliverableStatus.pending ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleAccept(item.id)}
                              disabled={isThisPending}
                              className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs h-7 px-3"
                            >
                              {isThisPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              )}
                              Accept
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleReject(item.id)}
                              disabled={isThisPending}
                              className="border-red-300 text-red-700 hover:bg-red-50 text-xs h-7 px-3"
                            >
                              {isThisPending ? (
                                <Loader2 className="h-3 w-3 animate-spin" />
                              ) : (
                                <XCircle className="h-3 w-3 mr-1" />
                              )}
                              Reject
                            </Button>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground italic">No action required</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
