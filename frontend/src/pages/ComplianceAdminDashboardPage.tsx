import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Plus } from 'lucide-react';
import AdminGuard from '../components/AdminGuard';
import ComplianceAdminToDoList from '../components/ComplianceAdminToDoList';
import ComplianceAdminTimeline from '../components/ComplianceAdminTimeline';
import ComplianceAdminFollowUp from '../components/ComplianceAdminFollowUp';
import CreateToDoForm from '../components/CreateToDoForm';
import CreateTimelineForm from '../components/CreateTimelineForm';
import CreateFollowUpForm from '../components/CreateFollowUpForm';

export default function ComplianceAdminDashboardPage() {
  const [toDoDialogOpen, setToDoDialogOpen] = useState(false);
  const [timelineDialogOpen, setTimelineDialogOpen] = useState(false);
  const [followUpDialogOpen, setFollowUpDialogOpen] = useState(false);

  return (
    <AdminGuard>
      <div className="min-h-screen bg-background">
        <div className="bg-navy py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold text-white">
              Compliance Admin <span className="text-gold">Portal</span>
            </h1>
            <p className="text-white/60 text-sm mt-1">
              Manage compliance tasks, timelines, and follow-ups for all clients
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Tabs defaultValue="todos">
            <TabsList className="grid w-full grid-cols-3 mb-6">
              <TabsTrigger value="todos">To-Do List</TabsTrigger>
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="followup">Follow-Up</TabsTrigger>
            </TabsList>

            <TabsContent value="todos">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">To-Do List</h2>
                  <Dialog open={toDoDialogOpen} onOpenChange={setToDoDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gold hover:bg-gold/90 text-navy">
                        <Plus className="h-4 w-4 mr-1" />
                        Add To-Do
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
                      <DialogHeader>
                        <DialogTitle>Create To-Do</DialogTitle>
                      </DialogHeader>
                      <CreateToDoForm onSuccess={() => setToDoDialogOpen(false)} />
                    </DialogContent>
                  </Dialog>
                </div>
                <ComplianceAdminToDoList />
              </div>
            </TabsContent>

            <TabsContent value="timeline">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Timeline</h2>
                  <Dialog open={timelineDialogOpen} onOpenChange={setTimelineDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gold hover:bg-gold/90 text-navy">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Timeline Entry
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
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

            <TabsContent value="followup">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Follow-Up</h2>
                  <Dialog open={followUpDialogOpen} onOpenChange={setFollowUpDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gold hover:bg-gold/90 text-navy">
                        <Plus className="h-4 w-4 mr-1" />
                        Add Follow-Up
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-lg">
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
    </AdminGuard>
  );
}
