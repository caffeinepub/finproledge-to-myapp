import { FollowUpItem } from '../backend';
import { useGetAllFollowUps } from '../hooks/useComplianceAdmin';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { FollowUpStatusSelect } from './TaskStatusSelect';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, User } from 'lucide-react';

function ClientNameCell({ principalStr }: { principalStr: string | undefined }) {
  const { data: profile, isLoading } = useGetUserProfileByPrincipal(principalStr ?? null);

  if (!principalStr) return <span className="text-muted-foreground text-sm">—</span>;
  if (isLoading) return <Skeleton className="h-4 w-24" />;
  if (!profile) return <span className="text-muted-foreground text-xs">{principalStr.slice(0, 12)}…</span>;

  return (
    <div className="flex items-center gap-2">
      <User className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
      <div>
        <div className="font-medium text-sm text-foreground">{profile.name}</div>
        <div className="text-xs text-muted-foreground">{profile.email}</div>
        {profile.company && <div className="text-xs text-muted-foreground">{profile.company}</div>}
      </div>
    </div>
  );
}

export default function ComplianceAdminFollowUp() {
  const { data: followUps, isLoading, error } = useGetAllFollowUps();

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-12 w-full" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-destructive">
        Failed to load Follow-Up items. Please try again.
      </div>
    );
  }

  if (!followUps || followUps.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Bell className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No Follow-Up items yet</p>
        <p className="text-sm mt-1">Create a new Follow-Up to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Assigned Client</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Notes</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {followUps.map((item) => (
            <TableRow key={item.id.toString()}>
              <TableCell>
                <div>
                  <div className="font-medium text-foreground">{item.title}</div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground mt-0.5 max-w-xs truncate">
                      {item.description}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <ClientNameCell
                  principalStr={
                    item.clientReference?.toString() ?? item.clientPrincipal?.toString()
                  }
                />
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(Number(item.dueDate) / 1_000_000).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell className="text-muted-foreground text-sm max-w-xs truncate">
                {item.notes || '—'}
              </TableCell>
              <TableCell>
                <FollowUpStatusSelect
                  followUpId={item.id}
                  currentStatus={item.status}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
