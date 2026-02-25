import React, { useState, useRef } from 'react';
import { ExternalBlob, DocumentType } from '../backend';
import { useUploadDocument } from '../hooks/useDocuments';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, FileText, CheckCircle, AlertCircle, X } from 'lucide-react';

export default function DocumentUploadForm() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [docType, setDocType] = useState<DocumentType | ''>('');
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadDocument = useUploadDocument();

  const docTypeOptions: { value: DocumentType; label: string }[] = [
    { value: DocumentType.taxFiling, label: 'Tax Filing' },
    { value: DocumentType.payrollReport, label: 'Payroll Report' },
    { value: DocumentType.auditDoc, label: 'Audit Document' },
  ];

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    setSuccessMessage(null);
    uploadDocument.reset();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFileChange(e.target.files?.[0] ?? null);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFileChange(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const handleRemoveFile = () => {
    setSelectedFile(null);
    setUploadProgress(0);
    uploadDocument.reset();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !docType) return;

    setSuccessMessage(null);
    setUploadProgress(0);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer);
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });

      const result = await uploadDocument.mutateAsync({
        docType: docType as DocumentType,
        name: selectedFile.name,
        file: blob,
      });

      if (result.__kind__ === 'ok') {
        setSuccessMessage(`"${selectedFile.name}" uploaded successfully.`);
        setSelectedFile(null);
        setDocType('');
        setUploadProgress(0);
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else if (result.__kind__ === 'notApproved') {
        // handled via uploadDocument.error display below
      }
    } catch {
      // error shown via uploadDocument.isError
    }
  };

  const isNotApproved =
    !uploadDocument.isError &&
    uploadDocument.data?.__kind__ === 'notApproved';

  const canSubmit = !!selectedFile && !!docType && !uploadDocument.isPending;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-base font-serif font-semibold text-foreground mb-1 flex items-center gap-2">
        <UploadCloud className="h-4 w-4 text-primary" />
        Upload Document
      </h2>
      <p className="text-xs text-muted-foreground mb-5">
        Upload your financial documents securely. Accepted formats: PDF, XLSX, DOCX, CSV, and images.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Drop Zone */}
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-lg transition-colors cursor-pointer
            ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}
            ${selectedFile ? 'cursor-default' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleInputChange}
            accept=".pdf,.xlsx,.xls,.docx,.doc,.csv,.png,.jpg,.jpeg"
          />

          {selectedFile ? (
            <div className="flex items-center gap-3 px-4 py-3">
              <FileText className="h-8 w-8 text-primary flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); handleRemoveFile(); }}
                className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Remove file"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <UploadCloud className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm font-medium text-foreground">Drop your file here, or <span className="text-primary underline">browse</span></p>
              <p className="text-xs text-muted-foreground mt-1">PDF, XLSX, DOCX, CSV, PNG, JPG</p>
            </div>
          )}
        </div>

        {/* Document Type */}
        <div className="space-y-1.5">
          <Label htmlFor="doc-type" className="text-sm font-medium text-foreground">
            Document Type <span className="text-destructive">*</span>
          </Label>
          <Select value={docType} onValueChange={(v) => setDocType(v as DocumentType)}>
            <SelectTrigger id="doc-type" className="w-full border-border">
              <SelectValue placeholder="Select document type…" />
            </SelectTrigger>
            <SelectContent>
              {docTypeOptions.map(opt => (
                <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Upload Progress */}
        {uploadDocument.isPending && uploadProgress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Uploading…</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-1.5" />
          </div>
        )}

        {/* Success Message */}
        {successMessage && (
          <div className="flex items-center gap-2 text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 rounded px-3 py-2">
            <CheckCircle className="h-4 w-4 flex-shrink-0" />
            {successMessage}
          </div>
        )}

        {/* Not Approved Warning */}
        {isNotApproved && (
          <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            Your account is pending approval. Please wait for admin approval before uploading documents.
          </div>
        )}

        {/* Error Message */}
        {uploadDocument.isError && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded px-3 py-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            Upload failed. Please try again.
          </div>
        )}

        <Button
          type="submit"
          disabled={!canSubmit}
          className="w-full sm:w-auto"
        >
          {uploadDocument.isPending ? (
            <>
              <span className="inline-block h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
              Uploading…
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4 mr-2" />
              Upload Document
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
