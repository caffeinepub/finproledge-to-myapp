import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { FolderOpen, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useGetMyDeliverables } from '../hooks/useDeliverables';
import { DeliverableStatus, DeliverableType } from '../backend';

function getTypeLabel(type: DeliverableType): string {
  switch (type) {
    case DeliverableType.consulting: return 'Consulting';
    case DeliverableType.monthly: return 'Monthly Report';
    case DeliverableType.annual: return 'Annual Filing';
    case DeliverableType.quarterly: return 'Quarterly Report';
    default: return 'Document';
  }
}

export default function ComplianceDocumentList() {
  const { data: deliverables, isLoading } = useGetMyDeliverables();

  const completedDocs = deliverables?.filter(
    d => d.status === DeliverableStatus.completed || d.status === DeliverableStatus.approved
  ) ?? [];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-primary" />
          My Documents
        </CardTitle>
        <CardDescription>
          All your completed and approved compliance documents in one place.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <Skeleton key={i} className="h-16 w-full rounded-lg" />
            ))}
          </div>
        ) : completedDocs.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <FolderOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg font-medium">No documents yet</p>
            <p className="text-sm">Completed and approved deliverables will appear here.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {completedDocs.map(doc => {
              const dueDateMs = Number(doc.dueDate) / 1_000_000;
              const completionDate = new Date(dueDateMs).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={doc.id.toString()}
                  className="flex items-center justify-between p-4 rounded-lg border border-border bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="p-2 rounded-lg bg-primary/10 shrink-0">
                      <FileText className="h-4 w-4 text-primary" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium text-foreground text-sm truncate">{doc.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {getTypeLabel(doc.deliverableType)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{completionDate}</span>
                        {doc.status === DeliverableStatus.approved && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                            Approved
                          </span>
                        )}
                        {doc.status === DeliverableStatus.completed && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 border border-green-200">
                            Completed
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="shrink-0 text-muted-foreground hover:text-foreground" disabled>
                    <Download className="h-4 w-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
