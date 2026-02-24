import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download } from 'lucide-react';
import { ClientDocument } from '../backend';
import { formatDeadline } from '../utils/dateHelpers';

interface DocumentTableProps {
  documents: ClientDocument[];
}

export default function DocumentTable({ documents }: DocumentTableProps) {
  const getDocTypeLabel = (docType: string) => {
    switch (docType) {
      case 'taxFiling':
        return 'Tax Filing';
      case 'payrollReport':
        return 'Payroll Report';
      case 'auditDoc':
        return 'Audit Document';
      default:
        return docType;
    }
  };

  const handleDownload = (doc: ClientDocument) => {
    const url = doc.file.getDirectURL();
    window.open(url, '_blank');
  };

  return (
    <div className="rounded-md border">
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
            <TableRow key={doc.id.toString()}>
              <TableCell className="font-medium">{doc.name}</TableCell>
              <TableCell>
                <Badge variant="outline">{getDocTypeLabel(doc.docType)}</Badge>
              </TableCell>
              <TableCell>{formatDeadline(doc.uploadedAt)}</TableCell>
              <TableCell className="text-right">
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDownload(doc)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
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
