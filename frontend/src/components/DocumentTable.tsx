import React, { useState } from 'react';
import { useGetAllDocuments } from '../hooks/useDocuments';
import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { ClientDocument, DocumentType } from '../backend';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import DownloadOptionsMenu, { DownloadFile } from './DownloadOptionsMenu';

const ADMIN_EMAIL = 'finproledge@gmail.com';

const DOC_TYPE_LABELS: Record<string, { label: string; color: string }> = {
  taxFiling: { label: 'Tax Filing', color: 'bg-blue-100 text-blue-800' },
  payrollReport: { label: 'Payroll Report', color: 'bg-green-100 text-green-800' },
  auditDoc: { label: 'Audit Document', color: 'bg-purple-100 text-purple-800' },
  gstFiling: { label: 'GST Filing', color: 'bg-orange-100 text-orange-800' },
  tdsFiling: { label: 'TDS Filing', color: 'bg-red-100 text-red-800' },
  financialManagement: { label: 'Financial Management', color: 'bg-teal-100 text-teal-800' },
  accountingServices: { label: 'Accounting Services', color: 'bg-indigo-100 text-indigo-800' },
  loanFinancing: { label: 'Loan Financing', color: 'bg-yellow-100 text-yellow-800' },
};

function getDocTypeInfo(docType: DocumentType) {
  const key = docType as unknown as string;
  return DOC_TYPE_LABELS[key] ?? { label: key, color: 'bg-gray-100 text-gray-800' };
}

function formatDate(timestamp: bigint): string {
  const ms = Number(timestamp) / 1_000_000;
  return new Date(ms).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

interface DocumentTableProps {
  documents?: ClientDocument[];
  isLoading?: boolean;
}

export default function DocumentTable({ documents: propDocuments, isLoading: propLoading }: DocumentTableProps) {
  const { identity } = useInternetIdentity();
  const userEmail = identity ? undefined : undefined; // resolved via profile

  // Determine if admin by checking profile email stored in localStorage or via prop
  // We rely on AdminGuard wrapping the admin page; here we check if documents prop is passed (admin mode)
  const isAdminMode = propDocuments !== undefined;

  const { data: fetchedDocuments, isLoading: fetchLoading } = useGetAllDocuments();

  const documents = propDocuments ?? fetchedDocuments ?? [];
  const isLoading = propLoading ?? fetchLoading;

  async function handleDownload(doc: ClientDocument) {
    const bytes = await doc.file.getBytes();
    const blob = new Blob([bytes], { type: doc.mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }

  // Build table rows for export
  const tableRows = documents.map(doc => ({
    ID: String(doc.id),
    Name: doc.name,
    Type: getDocTypeInfo(doc.docType).label,
    'MIME Type': doc.mimeType,
    'Uploaded At': formatDate(doc.uploadedAt),
    Client: doc.client.toString(),
  }));

  // Build file list for ZIP/Image downloads
  const downloadFiles: DownloadFile[] = documents.map(doc => ({
    name: doc.name,
    mimeType: doc.mimeType,
    getBytes: () => doc.file.getBytes(),
  }));

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gold" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-5 w-5 text-gold" />
          <h3 className="font-semibold text-foreground">
            Documents ({documents.length})
          </h3>
        </div>
        {isAdminMode && (
          <DownloadOptionsMenu
            tableData={tableRows}
            title="Client Documents"
            files={downloadFiles}
            availableFormats={['pdf', 'spreadsheet', 'document', 'csv', 'zip', 'image']}
          />
        )}
      </div>

      {documents.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-3 opacity-30" />
          <p>No documents found.</p>
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Uploaded</TableHead>
                {isAdminMode && <TableHead className="font-semibold">Client</TableHead>}
                <TableHead className="font-semibold text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {documents.map(doc => {
                const typeInfo = getDocTypeInfo(doc.docType);
                return (
                  <TableRow key={String(doc.id)} className="hover:bg-muted/30">
                    <TableCell className="font-medium max-w-[200px] truncate">
                      {doc.name}
                    </TableCell>
                    <TableCell>
                      <Badge className={`text-xs ${typeInfo.color} border-0`}>
                        {typeInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(doc.uploadedAt)}
                    </TableCell>
                    {isAdminMode && (
                      <TableCell className="text-xs text-muted-foreground font-mono max-w-[120px] truncate">
                        {doc.client.toString().slice(0, 12)}…
                      </TableCell>
                    )}
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownload(doc)}
                        className="gap-1 text-gold hover:text-gold hover:bg-gold/10"
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
