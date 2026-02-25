import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ListTodo, Search, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetAllComplianceDeliverables } from '../hooks/useDeliverables';
import { useGetUserProfileByPrincipal } from '../hooks/useUserProfile';
import { ComplianceDeliverable, DeliverableStatus, DeliverableType } from '../backend';
import { calculateDaysRemaining } from '../utils/dateHelpers';

function getStatusLabel(status: DeliverableStatus): string {
  switch (status) {
    case DeliverableStatus.drafting: return 'Drafting';
    case DeliverableStatus.inReview: return 'In Review';
    case DeliverableStatus.completed: return 'Completed';
    case DeliverableStatus.approved: return 'Approved';
    case DeliverableStatus.rejected: return 'Rejected';
    default: return 'Unknown';
  }
}

function getStatusColor(status: DeliverableStatus): string {
  switch (status) {
    case DeliverableStatus.drafting: return 'bg-gray-100 text-gray-700 border-gray-200';
    case DeliverableStatus.inReview: return 'bg-blue-100 text-blue-700 border-blue-200';
    case DeliverableStatus.completed: return 'bg-green-100 text-green-700 border-green-200';
    case DeliverableStatus.approved: return 'bg-emerald-100 text-emerald-700 border-emerald-200';
    case DeliverableStatus.rejected: return 'bg-red-100 text-red-700 border-red-200';
    default: return 'bg-gray-100 text-gray-700 border-gray-200';
  }
}

function getTypeLabel(type: DeliverableType): string {
  switch (type) {
    case DeliverableType.consulting: return 'Consulting';
    case DeliverableType.monthly: return 'Monthly';
    case DeliverableType.annual: return 'Annual';
    case DeliverableType.quarterly: return 'Quarterly';
    default: return 'General';
  }
}

function ClientName({ principal }: { principal: string }) {
  const { data: profile, isLoading } = useGetUserProfileByPrincipal(principal);
  if (isLoading) return <span className="text-muted-foreground text-xs">Loading...</span>;
  if (!profile) return <span className="text-muted-foreground text-xs font-mono">{principal.slice(0, 12)}...</span>;
  return <span>{profile.name}</span>;
}

type SortField = 'dueDate' | 'status' | 'title';
type SortDir = 'asc' | 'desc';

export default function ComplianceAdminToDoList() {
  const { data: deliverables, isLoading } = useGetAllComplianceDeliverables();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('dueDate');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  const filtered = useMemo(() => {
    if (!deliverables) return [];
    let result = [...deliverables];

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(d => d.title.toLowerCase().includes(q));
    }

    if (statusFilter !== 'all') {
      result = result.filter(d => d.status === statusFilter);
    }

    result.sort((a, b) => {
      let cmp = 0;
      if (sortField === 'dueDate') {
        cmp = Number(a.dueDate) - Number(b.dueDate);
      } else if (sortField === 'status') {
        cmp = getStatusLabel(a.status).localeCompare(getStatusLabel(b.status));
      } else if (sortField === 'title') {
        cmp = a.title.localeCompare(b.title);
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [deliverables, search, statusFilter, sortField, sortDir]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDir('asc');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListTodo className="h-5 w-5 text-primary" />
          All Client Tasks
        </CardTitle>
        <CardDescription>
          Every compliance task across all clients in one place. Sort and filter to prioritize your work.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tasks..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value={DeliverableStatus.drafting}>Drafting</SelectItem>
              <SelectItem value={DeliverableStatus.inReview}>In Review</SelectItem>
              <SelectItem value={DeliverableStatus.completed}>Completed</SelectItem>
              <SelectItem value={DeliverableStatus.approved}>Approved</SelectItem>
              <SelectItem value={DeliverableStatus.rejected}>Rejected</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-12 w-full" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <ListTodo className="h-10 w-10 mx-auto mb-3 opacity-30" />
            <p>No tasks found.</p>
          </div>
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Client</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-auto p-0 font-semibold" onClick={() => toggleSort('title')}>
                      Task <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                    </Button>
                  </TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-auto p-0 font-semibold" onClick={() => toggleSort('status')}>
                      Status <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" size="sm" className="h-auto p-0 font-semibold" onClick={() => toggleSort('dueDate')}>
                      Due Date <ArrowUpDown className="ml-1 h-3 w-3 inline" />
                    </Button>
                  </TableHead>
                  <TableHead>Days Left</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map(d => {
                  const days = calculateDaysRemaining(d.dueDate);
                  const dueDateMs = Number(d.dueDate) / 1_000_000;
                  const dueDateStr = new Date(dueDateMs).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'short', year: 'numeric',
                  });
                  return (
                    <TableRow key={d.id.toString()} className={days < 0 ? 'bg-red-50/40 dark:bg-red-950/10' : days <= 5 ? 'bg-amber-50/40 dark:bg-amber-950/10' : ''}>
                      <TableCell className="font-medium text-sm">
                        <ClientName principal={d.client.toString()} />
                      </TableCell>
                      <TableCell className="font-medium">{d.title}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-xs">{getTypeLabel(d.deliverableType)}</Badge>
                      </TableCell>
                      <TableCell>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(d.status)}`}>
                          {getStatusLabel(d.status)}
                        </span>
                      </TableCell>
                      <TableCell className="text-sm">{dueDateStr}</TableCell>
                      <TableCell>
                        {days < 0 ? (
                          <span className="text-xs font-bold text-red-600">Overdue</span>
                        ) : days <= 5 ? (
                          <span className="text-xs font-bold text-amber-600">{days}d ⚠️</span>
                        ) : (
                          <span className="text-xs text-muted-foreground">{days}d</span>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}
        <p className="text-xs text-muted-foreground mt-3">{filtered.length} task{filtered.length !== 1 ? 's' : ''} shown</p>
      </CardContent>
    </Card>
  );
}
