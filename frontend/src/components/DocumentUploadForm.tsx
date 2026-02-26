import React, { useState, useRef } from 'react';
import { Upload, X, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DocumentType } from '../backend';
import { useUploadDocument } from '../hooks/useDocuments';
import { ExternalBlob } from '../backend';

const documentTypeLabels: Record<string, string> = {
  taxFiling: 'Tax Filing',
  payrollReport: 'Payroll Report',
  auditDoc: 'Audit Document',
  gstFiling: 'GST Filing',
  tdsFiling: 'TDS Filing',
  financialManagement: 'Financial Management',
  accountingServices: 'Accounting Services',
  loanFinancing: 'Loan Financing',
};

export default function DocumentUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadDocument();

  const handleFileSelect = (file: File) => {
    setSelectedFile(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFileSelect(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !docType) return;

    try {
      // Read file as ArrayBuffer to preserve binary data exactly
      const arrayBuffer = await selectedFile.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;
      const blob = ExternalBlob.fromBytes(uint8Array);

      await uploadMutation.mutateAsync({
        docType: docType as DocumentType,
        name: selectedFile.name,
        mimeType: selectedFile.type || 'application/octet-stream',
        file: blob,
      });

      setSelectedFile(null);
      setDocType('');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          isDragging
            ? 'border-gold bg-gold/10'
            : 'border-border hover:border-gold/50'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleInputChange}
          accept=".pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.txt,.csv"
        />
        {selectedFile ? (
          <div className="flex items-center justify-center gap-3">
            <FileText className="h-8 w-8 text-gold" />
            <div className="text-left">
              <p className="font-medium text-foreground">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground">
                {(selectedFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="ml-2 text-muted-foreground hover:text-destructive"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        ) : (
          <div>
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-foreground font-medium">Drop your file here or click to browse</p>
            <p className="text-sm text-muted-foreground mt-1">
              Supports PDF, Word, Excel, Images, and more
            </p>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="docType">Document Type</Label>
        <Select value={docType} onValueChange={setDocType}>
          <SelectTrigger id="docType">
            <SelectValue placeholder="Select document type" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(documentTypeLabels).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        onClick={handleUpload}
        disabled={!selectedFile || !docType || uploadMutation.isPending}
        className="w-full bg-gold hover:bg-gold/90 text-navy font-semibold"
      >
        {uploadMutation.isPending ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin h-4 w-4 border-2 border-navy border-t-transparent rounded-full" />
            Uploading...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Upload className="h-4 w-4" />
            Upload Document
          </span>
        )}
      </Button>

      {uploadMutation.isSuccess && (
        <p className="text-sm text-green-600 text-center">Document uploaded successfully!</p>
      )}
      {uploadMutation.isError && (
        <p className="text-sm text-destructive text-center">
          Upload failed. Please try again.
        </p>
      )}
    </div>
  );
}
