import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MyComplianceTasksSection from '../components/MyComplianceTasksSection';
import ClientDeliverableForm from '../components/ClientDeliverableForm';
import ClientDeliverableTable from '../components/ClientDeliverableTable';
import ClientTasksTab from '../components/ClientTasksTab';
import ComplianceDocumentList from '../components/ComplianceDocumentList';

export default function ComplianceDashboardPage() {
  const { identity } = useInternetIdentity();

  if (!identity) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground mb-2">Authentication Required</h2>
          <p className="text-muted-foreground">Please log in to access the compliance dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Compliance Dashboard</h1>
          <p className="text-muted-foreground mt-1">Manage your compliance tasks, deliverables, and documents.</p>
        </div>

        <Tabs defaultValue="tasks">
          <TabsList className="mb-6">
            <TabsTrigger value="tasks">My Compliance Tasks</TabsTrigger>
            <TabsTrigger value="deliverables">My Deliverables</TabsTrigger>
            <TabsTrigger value="taskdeadlines">Tasks</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks">
            <MyComplianceTasksSection />
          </TabsContent>

          <TabsContent value="deliverables">
            <div className="space-y-6">
              <ClientDeliverableForm />
              <ClientDeliverableTable />
            </div>
          </TabsContent>

          <TabsContent value="taskdeadlines">
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
