import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ClientDocument, DocumentType } from '../backend';

interface DocumentTableProps {
  documents: ClientDocument[];
}

function DocTypeBadge({ docType }: { docType: DocumentType }) {
  const map: Record<string, { label: string; className: string }> = {
    [DocumentType.taxFiling]: { label: 'Tax Filing', className: 'bg-blue-100 text-blue-700 border-blue-200' },
    [DocumentType.payrollReport]: { label: 'Payroll Report', className: 'bg-purple-100 text-purple-700 border-purple-200' },
    [DocumentType.auditDoc]: { label: 'Audit Doc', className: 'bg-orange-100 text-orange-700 border-orange-200' },
  };
  const config = map[docType as string] ?? { label: String(docType), className: '' };
  return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
}

export default function DocumentTable({ documents }: DocumentTableProps) {
  const handleDownload = (doc: ClientDocument) => {
    const url = doc.file.getDirectURL();
    const a = document.createElement('a');
    a.href = url;
    a.download = doc.name;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  if (documents.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <FileText className="w-12 h-12 mx-auto mb-4 opacity-30" />
        <p>No documents uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-sm overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Document Name</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Upload Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={String(doc.id)}>
              <TableCell className="font-medium flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                {doc.name}
              </TableCell>
              <TableCell>
                <DocTypeBadge docType={doc.docType} />
              </TableCell>
              <TableCell className="text-sm text-muted-foreground">
                {new Date(Number(doc.uploadedAt) / 1_000_000).toLocaleDateString()}
              </TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => handleDownload(doc)}
                  className="gap-1"
                >
                  <Download className="w-3 h-3" />
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
