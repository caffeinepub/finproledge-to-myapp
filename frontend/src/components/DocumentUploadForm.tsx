import { useState, useRef } from 'react';
import { DocumentType, ExternalBlob } from '../backend';
import { useUploadDocument } from '../hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import { Upload, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const DOCUMENT_TYPE_OPTIONS: { value: DocumentType; label: string }[] = [
  { value: DocumentType.taxFiling, label: 'Tax Filing' },
  { value: DocumentType.payrollReport, label: 'Payroll Report' },
  { value: DocumentType.auditDoc, label: 'Audit Document' },
  { value: DocumentType.gstFiling, label: 'GST Filing' },
  { value: DocumentType.tdsFiling, label: 'TDS Filing' },
  { value: DocumentType.financialManagement, label: 'Financial Management' },
  { value: DocumentType.accountingServices, label: 'Accounting Services' },
  { value: DocumentType.loanFinancing, label: 'Loan Financing' },
];

export default function DocumentUploadForm() {
  const [docType, setDocType] = useState<DocumentType>(DocumentType.taxFiling);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadDocument = useUploadDocument();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error('Please select a file to upload');
      return;
    }

    try {
      setUploadProgress(0);
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;
      const blob = ExternalBlob.fromBytes(uint8Array).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });

      const result = await uploadDocument.mutateAsync({
        docType,
        name: selectedFile.name,
        mimeType: selectedFile.type || 'application/octet-stream',
        file: blob,
      });

      if (result.__kind__ === 'notApproved') {
        toast.error('Your account is not yet approved. Please wait for admin approval.');
      } else {
        toast.success('Document uploaded successfully!');
        setSelectedFile(null);
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    } catch (err) {
      toast.error('Failed to upload document. Please try again.');
      setUploadProgress(0);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="docType">Document Type</Label>
        <Select value={docType} onValueChange={(val) => setDocType(val as DocumentType)}>
          <SelectTrigger id="docType">
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            {DOCUMENT_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>File</Label>
        <div
          className={`border-2 border-dashed rounded-sm p-8 text-center cursor-pointer transition-colors duration-200 ${
            isDragging
              ? 'border-primary bg-primary/5'
              : selectedFile
              ? 'border-green-400 bg-green-50'
              : 'border-border hover:border-primary/50 hover:bg-muted/30'
          }`}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          {selectedFile ? (
            <div className="flex flex-col items-center gap-2">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="w-8 h-8 text-muted-foreground" />
              <p className="font-medium text-foreground">Drop your file here or click to browse</p>
              <p className="text-sm text-muted-foreground">Supports all file types</p>
            </div>
          )}
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFileSelect(file);
            }}
          />
        </div>
      </div>

      {uploadDocument.isPending && uploadProgress > 0 && (
        <div className="space-y-1">
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Uploading...</span>
            <span>{uploadProgress}%</span>
          </div>
          <Progress value={uploadProgress} />
        </div>
      )}

      <Button
        type="submit"
        disabled={uploadDocument.isPending || !selectedFile}
        className="w-full"
      >
        {uploadDocument.isPending ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Uploading...
          </>
        ) : (
          <>
            <FileText className="w-4 h-4 mr-2" />
            Upload Document
          </>
        )}
      </Button>
    </form>
  );
}
