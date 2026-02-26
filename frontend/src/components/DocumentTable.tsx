import { ClientDocument, DocumentType } from '../backend';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentTableProps {
  documents: ClientDocument[];
}

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  [DocumentType.taxFiling]: 'Tax Filing',
  [DocumentType.payrollReport]: 'Payroll Report',
  [DocumentType.auditDoc]: 'Audit Document',
  [DocumentType.gstFiling]: 'GST Filing',
  [DocumentType.tdsFiling]: 'TDS Filing',
  [DocumentType.financialManagement]: 'Financial Management',
  [DocumentType.accountingServices]: 'Accounting Services',
  [DocumentType.loanFinancing]: 'Loan Financing',
};

const DOC_TYPE_COLORS: Record<DocumentType, string> = {
  [DocumentType.taxFiling]: 'bg-blue-100 text-blue-800',
  [DocumentType.payrollReport]: 'bg-purple-100 text-purple-800',
  [DocumentType.auditDoc]: 'bg-orange-100 text-orange-800',
  [DocumentType.gstFiling]: 'bg-green-100 text-green-800',
  [DocumentType.tdsFiling]: 'bg-teal-100 text-teal-800',
  [DocumentType.financialManagement]: 'bg-indigo-100 text-indigo-800',
  [DocumentType.accountingServices]: 'bg-pink-100 text-pink-800',
  [DocumentType.loanFinancing]: 'bg-yellow-100 text-yellow-800',
};

async function downloadDocument(doc: ClientDocument) {
  try {
    const bytes = await doc.file.getBytes();
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
  } catch (err) {
    toast.error('Failed to download document. Please try again.');
  }
}

export default function DocumentTable({ documents }: DocumentTableProps) {
  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p className="font-medium">No documents found</p>
        <p className="text-sm mt-1">Upload your first document to get started.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
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
          {documents.map((doc) => (
            <TableRow key={doc.id.toString()}>
              <TableCell>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground shrink-0" />
                  <span className="font-medium text-foreground truncate max-w-xs">{doc.name}</span>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    DOC_TYPE_COLORS[doc.docType] || 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {DOC_TYPE_LABELS[doc.docType] || doc.docType}
                </span>
              </TableCell>
              <TableCell className="text-muted-foreground text-sm">
                {new Date(Number(doc.uploadedAt) / 1_000_000).toLocaleDateString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                })}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => downloadDocument(doc)}
                  className="gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
