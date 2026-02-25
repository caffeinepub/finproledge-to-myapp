import React, { useState, useRef } from 'react';
import { ExternalBlob } from '../backend';
import { useSubmitClientDeliverable } from '../hooks/useClientDeliverables';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { UploadCloud, FileText, AlertCircle, X, PackageOpen } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientDeliverableForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const submitDeliverable = useSubmitClientDeliverable();

  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    submitDeliverable.reset();
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
    submitDeliverable.reset();
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile || !title.trim()) return;

    setUploadProgress(0);

    try {
      const arrayBuffer = await selectedFile.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((pct) => {
        setUploadProgress(pct);
      });

      await submitDeliverable.mutateAsync({
        title: title.trim(),
        description: description.trim(),
        file: blob,
      });

      toast.success('Deliverable submitted successfully!', {
        description: `"${title.trim()}" has been submitted and is awaiting review.`,
      });

      setTitle('');
      setDescription('');
      setSelectedFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch {
      // error shown via submitDeliverable.isError
    }
  };

  const canSubmit = !!selectedFile && !!title.trim() && !submitDeliverable.isPending;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6 shadow-sm">
      <h2 className="text-base font-serif font-semibold text-foreground mb-1 flex items-center gap-2">
        <PackageOpen className="h-4 w-4 text-primary" />
        Submit Deliverable
      </h2>
      <p className="text-xs text-muted-foreground mb-5">
        Upload your completed work for review. Accepted formats: PDF, XLSX, DOCX, CSV, ZIP, and images.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="deliverable-title" className="text-sm font-medium text-foreground">
            Title <span className="text-destructive">*</span>
          </Label>
          <Input
            id="deliverable-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Q1 2026 Financial Report"
            className="border-border"
            required
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="deliverable-description" className="text-sm font-medium text-foreground">
            Description <span className="text-muted-foreground font-normal">(optional)</span>
          </Label>
          <Textarea
            id="deliverable-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Briefly describe what this deliverable contains…"
            className="border-border resize-none"
            rows={3}
          />
        </div>

        {/* Drop Zone */}
        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-foreground">
            File <span className="text-destructive">*</span>
          </Label>
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-lg transition-colors
              ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50 hover:bg-muted/30'}
              ${selectedFile ? 'cursor-default' : 'cursor-pointer'}
            `}
          >
            <input
              ref={fileInputRef}
              type="file"
              className="hidden"
              onChange={handleInputChange}
              accept=".pdf,.xlsx,.xls,.docx,.doc,.csv,.zip,.png,.jpg,.jpeg"
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
                <p className="text-sm font-medium text-foreground">
                  Drop your file here, or <span className="text-primary underline">browse</span>
                </p>
                <p className="text-xs text-muted-foreground mt-1">PDF, XLSX, DOCX, CSV, ZIP, PNG, JPG</p>
              </div>
            )}
          </div>
        </div>

        {/* Upload Progress */}
        {submitDeliverable.isPending && uploadProgress > 0 && (
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Uploading…</span>
              <span>{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} className="h-1.5" />
          </div>
        )}

        {/* Error Message */}
        {submitDeliverable.isError && (
          <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded px-3 py-2">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            Submission failed. Please try again.
          </div>
        )}

        <Button
          type="submit"
          disabled={!canSubmit}
          className="w-full sm:w-auto"
        >
          {submitDeliverable.isPending ? (
            <>
              <span className="inline-block h-3.5 w-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin mr-2" />
              Submitting…
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4 mr-2" />
              Submit Deliverable
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
