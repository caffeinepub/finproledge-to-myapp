import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ListTodo, BarChart2, Bell, Clock } from 'lucide-react';
import AdminGuard from '../components/AdminGuard';
import ComplianceAdminToDoList from '../components/ComplianceAdminToDoList';
import ComplianceAdminTimeline from '../components/ComplianceAdminTimeline';
import ComplianceAdminFollowUp from '../components/ComplianceAdminFollowUp';
import ComplianceAdminDeadlineCountdown from '../components/ComplianceAdminDeadlineCountdown';

export default function ComplianceAdminDashboardPage() {
  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-lg bg-primary/10">
                <ListTodo className="h-6 w-6 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Compliance Admin Dashboard</h1>
            </div>
            <p className="text-muted-foreground ml-14">
              Manage all client compliance tasks, monitor workloads, follow up on stuck items, and never miss a deadline.
            </p>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="todo">
            <TabsList className="mb-6 grid grid-cols-4 w-full max-w-2xl">
              <TabsTrigger value="todo" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <ListTodo className="h-4 w-4" />
                <span className="hidden sm:inline">To-Do List</span>
                <span className="sm:hidden">Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="timeline" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <BarChart2 className="h-4 w-4" />
                <span className="hidden sm:inline">Timeline</span>
                <span className="sm:hidden">Timeline</span>
              </TabsTrigger>
              <TabsTrigger value="followup" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Follow-Up</span>
                <span className="sm:hidden">Follow-Up</span>
              </TabsTrigger>
              <TabsTrigger value="deadlines" className="flex items-center gap-1.5 text-xs sm:text-sm">
                <Clock className="h-4 w-4" />
                <span className="hidden sm:inline">Deadlines</span>
                <span className="sm:hidden">Deadlines</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="todo">
              <ComplianceAdminToDoList />
            </TabsContent>

            <TabsContent value="timeline">
              <ComplianceAdminTimeline />
            </TabsContent>

            <TabsContent value="followup">
              <ComplianceAdminFollowUp />
            </TabsContent>

            <TabsContent value="deadlines">
              <ComplianceAdminDeadlineCountdown />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </AdminGuard>
  );
}
