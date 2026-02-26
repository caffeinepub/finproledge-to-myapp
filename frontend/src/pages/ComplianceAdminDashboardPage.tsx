import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ComplianceAdminToDoList from '../components/ComplianceAdminToDoList';
import ComplianceAdminTimeline from '../components/ComplianceAdminTimeline';
import ComplianceAdminFollowUp from '../components/ComplianceAdminFollowUp';
import CreateToDoForm from '../components/CreateToDoForm';
import CreateTimelineForm from '../components/CreateTimelineForm';
import CreateFollowUpForm from '../components/CreateFollowUpForm';
import { Plus, CheckSquare, Calendar, Bell } from 'lucide-react';

export default function ComplianceAdminDashboardPage() {
  const [todoDialogOpen, setTodoDialogOpen] = useState(false);
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-navy py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-white">
            Compliance <span className="text-gold">Admin Dashboard</span>
          </h1>
          <p className="text-white/70 mt-2">
            Manage To-Dos, Timelines, and Follow-Ups for all clients.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="todos">
          <TabsList className="mb-6">
            <TabsTrigger value="todos" className="flex items-center gap-2">
              <CheckSquare className="w-4 h-4" />
              To-Do List
            </TabsTrigger>
            <TabsTrigger value="timeline" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Timeline
            </TabsTrigger>
            <TabsTrigger value="followup" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Follow-Up
            </TabsTrigger>
          </TabsList>

          {/* To-Do Tab */}
          <TabsContent value="todos">
            <div className="bg-card border border-border rounded-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">To-Do List</h2>
                <Dialog open={todoDialogOpen} onOpenChange={setTodoDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add To-Do
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create New To-Do</DialogTitle>
                    </DialogHeader>
                    <CreateToDoForm onSuccess={() => setTodoDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
              <ComplianceAdminToDoList />
            </div>
          </TabsContent>

          {/* Timeline Tab */}
          <TabsContent value="timeline">
            <div className="bg-card border border-border rounded-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Timeline</h2>
                <Dialog open={timelineDialogOpen} onOpenChange={setTimelineDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Timeline Entry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create Timeline Entry</DialogTitle>
                    </DialogHeader>
                    <CreateTimelineForm onSuccess={() => setTimelineDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
              <ComplianceAdminTimeline />
            </div>
          </TabsContent>

          {/* Follow-Up Tab */}
          <TabsContent value="followup">
            <div className="bg-card border border-border rounded-sm p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-foreground">Follow-Up</h2>
                <Dialog open={followUpDialogOpen} onOpenChange={setFollowUpDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="gap-2">
                      <Plus className="w-4 h-4" />
                      Add Follow-Up
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Create Follow-Up</DialogTitle>
                    </DialogHeader>
                    <CreateFollowUpForm onSuccess={() => setFollowUpDialogOpen(false)} />
                  </DialogContent>
                </Dialog>
              </div>
              <ComplianceAdminFollowUp />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
