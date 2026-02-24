import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetMyDeliverables, useGetMyPendingDeliverables } from '../hooks/useDeliverables';
import DeliverableCard from '../components/DeliverableCard';
import { Loader2, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { calculateDaysRemaining, isDueSoon } from '../utils/dateHelpers';

export default function ComplianceDashboardPage() {
  const { data: allDeliverables, isLoading: allLoading } = useGetMyDeliverables();
  const { data: pendingDeliverables, isLoading: pendingLoading } = useGetMyPendingDeliverables();

  const dueSoonCount = pendingDeliverables?.filter((d) => isDueSoon(d.dueDate)).length || 0;
  const completedCount = allDeliverables?.filter((d) => d.status === 'completed').length || 0;

  return (
    <div className="py-12 bg-muted/30 min-h-[calc(100vh-4rem)]">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Compliance Dashboard</h1>
            <p className="text-muted-foreground">
              Track deliverable timelines, review status, and deadline countdowns.
            </p>
          </div>

          {dueSoonCount > 0 && (
            <Alert className="mb-6 border-yellow-500/50 bg-yellow-500/10">
              <AlertTriangle className="h-4 w-4 text-yellow-600" />
              <AlertTitle className="text-yellow-600">Upcoming Deadlines</AlertTitle>
              <AlertDescription className="text-yellow-600/90">
                You have {dueSoonCount} deliverable{dueSoonCount > 1 ? 's' : ''} due within 5 days.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Total Deliverables</CardDescription>
                <CardTitle className="text-3xl">{allDeliverables?.length || 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Pending</CardDescription>
                <CardTitle className="text-3xl">{pendingDeliverables?.length || 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>Completed</CardDescription>
                <CardTitle className="text-3xl text-green-600">{completedCount}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pending Deliverables</CardTitle>
                <CardDescription>Items requiring attention or in progress</CardDescription>
              </CardHeader>
              <CardContent>
                {pendingLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : pendingDeliverables && pendingDeliverables.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {pendingDeliverables.map((deliverable) => (
                      <DeliverableCard key={deliverable.id.toString()} deliverable={deliverable} />
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <CheckCircle2 className="h-4 w-4" />
                    <AlertDescription>
                      All deliverables are up to date. Great work!
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>All Deliverables</CardTitle>
                <CardDescription>Complete history of your deliverables</CardDescription>
              </CardHeader>
              <CardContent>
                {allLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                  </div>
                ) : allDeliverables && allDeliverables.length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-4">
                    {allDeliverables.map((deliverable) => (
                      <DeliverableCard key={deliverable.id.toString()} deliverable={deliverable} />
                    ))}
                  </div>
                ) : (
                  <Alert>
                    <AlertDescription>
                      No deliverables found. They will appear here once created.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
