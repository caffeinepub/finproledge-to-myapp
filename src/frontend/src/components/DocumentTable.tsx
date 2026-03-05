import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Download, FileText, Filter } from "lucide-react";
import React, { useState } from "react";
import { type ClientDocument, DocumentType } from "../backend";
import { downloadExternalBlob } from "../utils/fileDownload";
import DownloadOptionsMenu from "./DownloadOptionsMenu";

interface DocumentTableProps {
  documents: ClientDocument[];
  isAdmin?: boolean;
}

const DOC_TYPE_LABELS: Record<DocumentType, string> = {
  [DocumentType.taxFiling]: "Tax Filing",
  [DocumentType.payrollReport]: "Payroll Report",
  [DocumentType.auditDoc]: "Audit Document",
  [DocumentType.gstFiling]: "GST Filing",
  [DocumentType.tdsFiling]: "TDS Filing",
  [DocumentType.financialManagement]: "Financial Management",
  [DocumentType.accountingServices]: "Accounting Services",
  [DocumentType.loanFinancing]: "Loan Financing",
};

const DOC_TYPE_COLORS: Record<DocumentType, string> = {
  [DocumentType.taxFiling]:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  [DocumentType.payrollReport]:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  [DocumentType.auditDoc]:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  [DocumentType.gstFiling]:
    "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  [DocumentType.tdsFiling]:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  [DocumentType.financialManagement]:
    "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  [DocumentType.accountingServices]:
    "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  [DocumentType.loanFinancing]:
    "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
};

const ALL_DOC_TYPES = Object.values(DocumentType);

export default function DocumentTable({
  documents,
  isAdmin = false,
}: DocumentTableProps) {
  const [selectedType, setSelectedType] = useState<string>("all");
  const [downloadingId, setDownloadingId] = useState<bigint | null>(null);

  const filteredDocuments =
    selectedType === "all"
      ? documents
      : documents.filter(
          (doc) => doc.docType === (selectedType as DocumentType),
        );

  const handleDownload = async (doc: ClientDocument) => {
    setDownloadingId(doc.id);
    try {
      await downloadExternalBlob(doc.file, doc.name, doc.mimeType);
    } catch {
      // error handled in utility
    } finally {
      setDownloadingId(null);
    }
  };

  const tableData = filteredDocuments.map((doc) => ({
    Name: doc.name,
    Type: DOC_TYPE_LABELS[doc.docType] ?? String(doc.docType),
    "Uploaded At": new Date(
      Number(doc.uploadedAt) / 1_000_000,
    ).toLocaleDateString(),
  }));

  const downloadFiles = filteredDocuments.map((doc) => ({
    name: doc.name,
    mimeType: doc.mimeType,
    getBytes: () => doc.file.getBytes(),
  }));

  return (
    <div className="space-y-4">
      {/* Filter Bar */}
      <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border border-border">
        <Filter className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="text-sm font-medium text-foreground">
          Filter by type:
        </span>
        <Select value={selectedType} onValueChange={setSelectedType}>
          <SelectTrigger className="w-52 h-8 text-sm">
            <SelectValue placeholder="All Documents" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Documents</SelectItem>
            {ALL_DOC_TYPES.map((type) => (
              <SelectItem key={type} value={type}>
                {DOC_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedType !== "all" && (
          <Button
            variant="ghost"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setSelectedType("all")}
          >
            Clear
          </Button>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          {filteredDocuments.length} document
          {filteredDocuments.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Admin bulk export */}
      {isAdmin && filteredDocuments.length > 0 && (
        <div className="flex justify-end">
          <DownloadOptionsMenu
            tableData={tableData}
            title="Documents"
            files={downloadFiles}
          />
        </div>
      )}

      {filteredDocuments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <FileText className="h-12 w-12 text-muted-foreground mb-3" />
          <p className="text-muted-foreground font-medium">
            {selectedType === "all"
              ? "No documents uploaded yet."
              : `No ${DOC_TYPE_LABELS[selectedType as DocumentType] ?? selectedType} documents found.`}
          </p>
          {selectedType !== "all" && (
            <Button
              variant="link"
              size="sm"
              onClick={() => setSelectedType("all")}
              className="mt-1"
            >
              Show all documents
            </Button>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/30">
                <TableHead className="font-semibold">Document Name</TableHead>
                <TableHead className="font-semibold">Type</TableHead>
                <TableHead className="font-semibold">Uploaded</TableHead>
                <TableHead className="font-semibold text-right">
                  Download
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments.map((doc) => (
                <TableRow key={String(doc.id)} className="hover:bg-muted/20">
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
                      <span className="truncate max-w-xs">{doc.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${DOC_TYPE_COLORS[doc.docType] ?? ""}`}
                    >
                      {DOC_TYPE_LABELS[doc.docType] ?? String(doc.docType)}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {new Date(
                      Number(doc.uploadedAt) / 1_000_000,
                    ).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownload(doc)}
                      disabled={downloadingId === doc.id}
                      className="gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      {downloadingId === doc.id ? "Downloading…" : "Download"}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
