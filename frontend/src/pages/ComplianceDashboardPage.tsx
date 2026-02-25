import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, FileText, FolderOpen, Clock, ListChecks } from 'lucide-react';
import { useGetMyDeliverables } from '../hooks/useDeliverables';
import { DeliverableStatus } from '../backend';
import { calculateDaysRemaining } from '../utils/dateHelpers';
import ComplianceDocumentList from '../components/ComplianceDocumentList';
import DeliverableCard from '../components/DeliverableCard';
import ClientTasksTab from '../components/ClientTasksTab';

export default function ComplianceDashboardPage() {
  const { data: deliverables, isLoading } = useGetMyDeliverables();

  const urgentItems = deliverables?.filter(d => {
    const days = calculateDaysRemaining(d.dueDate);
    return days <= 5 && days >= 0 && d.status !== DeliverableStatus.approved && d.status !== DeliverableStatus.completed;
  }) ?? [];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Compliance Dashboard</h1>
          <p className="text-muted-foreground">Track your compliance deliverables, tasks, and documents in one place.</p>
        </div>

        {/* Urgent Alerts */}
        {urgentItems.length > 0 && (
          <Alert className="mb-6 border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
            <AlertTriangle className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800 dark:text-amber-200">
              <strong>{urgentItems.length} item{urgentItems.length > 1 ? 's' : ''}</strong> due within 5 days. Please review and take action.
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Summary */}
        {!isLoading && deliverables && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border-border">
              <CardContent className="pt-4 pb-4">
                <div className="text-2xl font-bold text-foreground">{deliverables.length}</div>
                <div className="text-sm text-muted-foreground">Total Tasks</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-4 pb-4">
                <div className="text-2xl font-bold text-blue-600">
                  {deliverables.filter(d => d.status === DeliverableStatus.inReview).length}
                </div>
                <div className="text-sm text-muted-foreground">In Review</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-4 pb-4">
                <div className="text-2xl font-bold text-green-600">
                  {deliverables.filter(d => d.status === DeliverableStatus.completed || d.status === DeliverableStatus.approved).length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </CardContent>
            </Card>
            <Card className="border-border">
              <CardContent className="pt-4 pb-4">
                <div className="text-2xl font-bold text-amber-600">{urgentItems.length}</div>
                <div className="text-sm text-muted-foreground">Due Soon</div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="deliverables">
          <TabsList className="mb-6">
            <TabsTrigger value="deliverables" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              My Deliverables
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <ListChecks className="h-4 w-4" />
              Tasks &amp; Deadlines
            </TabsTrigger>
            <TabsTrigger value="documents" className="flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              Documents
            </TabsTrigger>
          </TabsList>

          <TabsContent value="deliverables">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  My Compliance Tasks
                </CardTitle>
                <CardDescription>
                  Real-time status of all your compliance deliverables. Approve or reject items when they are ready for your review.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Skeleton key={i} className="h-32 w-full rounded-lg" />
                    ))}
                  </div>
                ) : !deliverables || deliverables.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-30" />
                    <p className="text-lg font-medium">No deliverables yet</p>
                    <p className="text-sm">Your compliance tasks will appear here once assigned by your advisor.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {deliverables.map(deliverable => (
                      <DeliverableCard key={deliverable.id.toString()} deliverable={deliverable} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tasks">
            <ClientTasksTab />
          </TabsContent>

          <TabsContent value="documents">
            <ComplianceDocumentList />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
