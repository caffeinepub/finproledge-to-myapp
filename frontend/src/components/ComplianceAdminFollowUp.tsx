import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { useGetAllFollowUps } from '../hooks/useComplianceAdmin';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { FollowUpStatus } from '../backend';
import { FollowUpStatusSelect } from './TaskStatusSelect';

function ClientCell({ principalStr }: { principalStr: string }) {
  const { data: profile, isLoading } = useGetUserProfileByPrincipal(principalStr);

  if (isLoading) {
    return (
      <div className="space-y-1">
        <Skeleton className="h-3 w-24" />
        <Skeleton className="h-3 w-32" />
      </div>
    );
  }

  return (
    <div className="space-y-0.5 text-xs">
      {profile ? (
        <>
          <div className="font-medium text-foreground">{profile.name}</div>
          {profile.company && (
            <div className="text-muted-foreground">{profile.company}</div>
          )}
          <div className="text-muted-foreground font-mono text-[10px]">{principalStr.slice(0, 16)}…</div>
        </>
      ) : (
        <div className="font-mono text-muted-foreground">{principalStr.slice(0, 16)}…</div>
      )}
    </div>
  );
}

function formatDate(ns: bigint) {
  return new Date(Number(ns) / 1_000_000).toLocaleDateString();
}

export default function ComplianceAdminFollowUp() {
  const { data: followUps, isLoading } = useGetAllFollowUps();

  if (isLoading) {
    return (
      <div className="space-y-2">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">All Follow-Ups ({followUps?.length ?? 0})</h3>
      </div>

      {!followUps || followUps.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4 text-center">No follow-up items found.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Notes</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {followUps.map((item) => (
                <TableRow key={String(item.id)}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground mt-0.5">{item.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {item.clientPrincipal ? (
                      <ClientCell principalStr={item.clientPrincipal.toString()} />
                    ) : (
                      <span className="text-muted-foreground text-xs">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">{formatDate(item.dueDate)}</TableCell>
                  <TableCell>
                    <FollowUpStatusSelect
                      followUpId={item.id}
                      currentStatus={item.status}
                    />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground max-w-[200px] truncate">
                    {item.notes || '—'}
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
