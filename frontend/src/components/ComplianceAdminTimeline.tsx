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
import { useGetAllTimelines } from '../hooks/useComplianceAdmin';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { TimelineStatus } from '../backend';
import { TimelineStatusSelect } from './TaskStatusSelect';

function StatusBadge({ status }: { status: TimelineStatus }) {
  const map: Record<string, string> = {
    planned: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
    inProgress: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  };
  const label =
    status === TimelineStatus.planned
      ? 'Planned'
      : status === TimelineStatus.inProgress
      ? 'In Progress'
      : 'Completed';
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${map[status] ?? ''}`}>
      {label}
    </span>
  );
}

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

export default function ComplianceAdminTimeline() {
  const { data: timelines, isLoading } = useGetAllTimelines();

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
        <h3 className="text-lg font-semibold">All Timelines ({timelines?.length ?? 0})</h3>
      </div>

      {!timelines || timelines.length === 0 ? (
        <p className="text-muted-foreground text-sm py-4 text-center">No timeline entries found.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Client</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Task Ref</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {timelines.map((entry) => (
                <TableRow key={String(entry.id)}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{entry.title}</div>
                      {entry.description && (
                        <div className="text-xs text-muted-foreground mt-0.5">{entry.description}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {entry.clientPrincipal ? (
                      <ClientCell principalStr={entry.clientPrincipal.toString()} />
                    ) : (
                      <span className="text-muted-foreground text-xs">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs">{formatDate(entry.startDate)}</TableCell>
                  <TableCell className="text-xs">{formatDate(entry.endDate)}</TableCell>
                  <TableCell>
                    <TimelineStatusSelect
                      timelineId={entry.id}
                      currentStatus={entry.status}
                    />
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground">
                    {entry.taskReference != null ? String(entry.taskReference) : '—'}
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
