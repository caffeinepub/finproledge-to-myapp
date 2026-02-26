import React, { useState } from 'react';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ClientDocument, DocumentType } from '../backend';
import DownloadOptionsMenu from './DownloadOptionsMenu';

const docTypeLabels: Record<string, string> = {
  taxFiling: 'Tax Filing',
  payrollReport: 'Payroll Report',
  auditDoc: 'Audit Document',
  gstFiling: 'GST Filing',
  tdsFiling: 'TDS Filing',
  financialManagement: 'Financial Management',
  accountingServices: 'Accounting Services',
  loanFinancing: 'Loan Financing',
};

const docTypeColors: Record<string, string> = {
  taxFiling: 'bg-blue-100 text-blue-800',
  payrollReport: 'bg-green-100 text-green-800',
  auditDoc: 'bg-purple-100 text-purple-800',
  gstFiling: 'bg-orange-100 text-orange-800',
  tdsFiling: 'bg-red-100 text-red-800',
  financialManagement: 'bg-teal-100 text-teal-800',
  accountingServices: 'bg-indigo-100 text-indigo-800',
  loanFinancing: 'bg-yellow-100 text-yellow-800',
};

interface DocumentTableProps {
  documents: ClientDocument[];
  isAdmin?: boolean;
}

export default function DocumentTable({ documents, isAdmin }: DocumentTableProps) {
  const [downloadingId, setDownloadingId] = useState<bigint | null>(null);

  const handleDownload = async (doc: ClientDocument) => {
    setDownloadingId(doc.id);
    try {
      // Get raw bytes from ExternalBlob to preserve binary integrity
      const bytes = await doc.file.getBytes();
      // Use the stored mimeType to reconstruct the Blob correctly
      const mimeType = doc.mimeType || 'application/octet-stream';
      const blob = new Blob([bytes], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = doc.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    } finally {
      setDownloadingId(null);
    }
  };

  const formatDate = (timestamp: bigint) => {
    return new Date(Number(timestamp) / 1_000_000).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDocTypeKey = (docType: DocumentType): string => String(docType);

  const tableData = documents.map((doc) => ({
    Name: doc.name,
    Type: docTypeLabels[getDocTypeKey(doc.docType)] || 'Unknown',
    'Uploaded At': formatDate(doc.uploadedAt),
  }));

  const downloadFiles = documents.map((doc) => ({
    name: doc.name,
    mimeType: doc.mimeType,
    getBytes: () => doc.file.getBytes(),
  }));

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="h-12 w-12 mx-auto mb-3 opacity-40" />
        <p>No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {isAdmin && (
        <div className="flex justify-end">
          <DownloadOptionsMenu
            tableData={tableData}
            title="Client Documents"
            files={downloadFiles}
            availableFormats={['pdf', 'spreadsheet', 'document', 'csv', 'zip']}
          />
        </div>
      )}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Document Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Uploaded</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => {
              const typeKey = getDocTypeKey(doc.docType);
              return (
                <TableRow key={String(doc.id)}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate max-w-[200px]">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={docTypeColors[typeKey] || 'bg-gray-100 text-gray-800'}
                    >
                      {docTypeLabels[typeKey] || typeKey}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {formatDate(doc.uploadedAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      disabled={downloadingId === doc.id}
                      className="text-gold hover:text-gold/80"
                    >
                      {downloadingId === doc.id ? (
                        <span className="animate-spin h-4 w-4 border-2 border-gold border-t-transparent rounded-full inline-block" />
                      ) : (
                        <Download className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
