import React, { useState } from 'react';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useUserProfile';
import { useGetAllDocuments } from '../hooks/useDocuments';
import ServiceRequestForm from '../components/ServiceRequestForm';
import DocumentTable from '../components/DocumentTable';
import DocumentUploadForm from '../components/DocumentUploadForm';
import PaymentForm from '../components/PaymentForm';
import PaymentHistoryTable from '../components/PaymentHistoryTable';
import ClientDeliverableForm from '../components/ClientDeliverableForm';
import ClientDeliverableTable from '../components/ClientDeliverableTable';
import { FileText, CreditCard, ClipboardList, PackageOpen, Loader2 } from 'lucide-react';

type ActiveTab = 'requests' | 'documents' | 'payments' | 'deliverables';

export default function ClientPortalPage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const { data: allDocuments, isLoading: docsLoading } = useGetAllDocuments();
  const [activeTab, setActiveTab] = useState<ActiveTab>('requests');

  const callerPrincipal = identity?.getPrincipal().toString();
  const myDocuments = (allDocuments ?? []).filter(
    doc => doc.client.toString() === callerPrincipal
  );

  const tabs: { id: ActiveTab; label: string; icon: React.ReactNode }[] = [
    { id: 'requests', label: 'My Requests', icon: <ClipboardList className="h-4 w-4" /> },
    { id: 'documents', label: 'Documents', icon: <FileText className="h-4 w-4" /> },
    { id: 'payments', label: 'Payments', icon: <CreditCard className="h-4 w-4" /> },
    { id: 'deliverables', label: 'My Deliverables', icon: <PackageOpen className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-serif font-bold text-foreground">Client Portal</h1>
          {userProfile && (
            <p className="text-muted-foreground mt-1">
              Welcome back, <span className="font-semibold text-foreground">{userProfile.name}</span>
              {userProfile.company && (
                <span className="text-muted-foreground"> · {userProfile.company}</span>
              )}
            </p>
          )}
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'requests' && (
          <div>
            <ServiceRequestForm />
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            {/* Upload Form — always visible for authenticated clients */}
            <DocumentUploadForm />

            {/* Documents List */}
            {docsLoading ? (
              <div className="flex items-center justify-center py-12 text-muted-foreground">
                <Loader2 className="h-5 w-5 animate-spin mr-2" />
                Loading documents…
              </div>
            ) : (
              <DocumentTable documents={myDocuments} />
            )}
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-8">
            <PaymentForm />
            <PaymentHistoryTable />
          </div>
        )}

        {activeTab === 'deliverables' && (
          <div className="space-y-6">
            <ClientDeliverableForm />
            <ClientDeliverableTable />
          </div>
        )}
      </div>
    </div>
  );
}
