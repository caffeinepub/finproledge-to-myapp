import AdminGuard from '../components/AdminGuard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ComplianceAdminToDoList from '../components/ComplianceAdminToDoList';
import ComplianceAdminTimeline from '../components/ComplianceAdminTimeline';
import ComplianceAdminFollowUp from '../components/ComplianceAdminFollowUp';

export default function ComplianceAdminDashboardPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Compliance Admin Dashboard</h1>
            <p className="text-muted-foreground mt-1">Manage compliance tasks, timelines, and follow-ups.</p>
          </div>

          <Tabs defaultValue="todos">
            <TabsList className="mb-6">
              <TabsTrigger value="todos">To-Do List</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="followup">Follow-Up</TabsTrigger>
            </TabsList>

            <TabsContent value="todos">
              <ComplianceAdminToDoList />
            </TabsContent>

            <TabsContent value="timeline">
              <ComplianceAdminTimeline />
            </TabsContent>

            <TabsContent value="followup">
              <ComplianceAdminFollowUp />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  );
}
