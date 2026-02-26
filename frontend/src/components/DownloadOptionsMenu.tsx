import React, { useState } from 'react';
import { Download, FileText, FileSpreadsheet, File, Archive, Image, Loader2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  exportTableToCSV,
  exportTableToXLSX,
  exportToDocument,
  exportTableToPDF,
  exportAsZip,
  ExportableRow,
} from '@/utils/fileExport';

export interface DownloadFile {
  name: string;
  mimeType: string;
  getBytes: () => Promise<Uint8Array<ArrayBuffer>>;
}

interface DownloadOptionsMenuProps {
  /** Table rows to export for CSV/XLSX/PDF/DOCX formats */
  tableData?: ExportableRow[];
  /** Title used in PDF/DOCX headers and filenames */
  title?: string;
  /** File blobs available for ZIP/Image downloads */
  files?: DownloadFile[];
  /** Which formats to show (defaults to all) */
  availableFormats?: Array<'pdf' | 'spreadsheet' | 'document' | 'csv' | 'zip' | 'image'>;
  /** Optional extra className for the trigger button */
  className?: string;
}

const ALL_FORMATS: Array<'pdf' | 'spreadsheet' | 'document' | 'csv' | 'zip' | 'image'> = [
  'pdf',
  'spreadsheet',
  'document',
  'csv',
  'zip',
  'image',
];

export default function DownloadOptionsMenu({
  tableData = [],
  title = 'Export',
  files = [],
  availableFormats = ALL_FORMATS,
  className,
}: DownloadOptionsMenuProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const safeTitle = title.replace(/[^a-zA-Z0-9_\- ]/g, '').trim() || 'export';
  const slug = safeTitle.toLowerCase().replace(/\s+/g, '-');

  async function handle(format: string, action: () => Promise<void> | void) {
    setLoading(format);
    try {
      await action();
    } finally {
      setLoading(null);
    }
  }

  const formatOptions: Array<{
    key: 'pdf' | 'spreadsheet' | 'document' | 'csv' | 'zip' | 'image';
    label: string;
    description: string;
    icon: React.ReactNode;
    action: () => Promise<void> | void;
  }> = [
    {
      key: 'pdf',
      label: 'PDF',
      description: 'Print-ready PDF document',
      icon: <FileText className="h-4 w-4 text-red-500" />,
      action: () => exportTableToPDF(tableData, safeTitle, slug),
    },
    {
      key: 'spreadsheet',
      label: 'Spreadsheet',
      description: 'Excel-compatible .xlsx file',
      icon: <FileSpreadsheet className="h-4 w-4 text-green-600" />,
      action: () => exportTableToXLSX(tableData, `${slug}.xlsx`),
    },
    {
      key: 'document',
      label: 'Document',
      description: 'Word-compatible .docx file',
      icon: <File className="h-4 w-4 text-blue-600" />,
      action: () => exportToDocument(tableData, safeTitle, `${slug}.docx`),
    },
    {
      key: 'csv',
      label: 'CSV',
      description: 'Comma-separated values',
      icon: <FileText className="h-4 w-4 text-yellow-600" />,
      action: () => exportTableToCSV(tableData, `${slug}.csv`),
    },
    {
      key: 'zip',
      label: 'ZIP Archive',
      description: files.length > 0 ? `Download ${files.length} file(s)` : 'Bundle all files',
      icon: <Archive className="h-4 w-4 text-purple-600" />,
      action: async () => {
        if (files.length > 0) {
          await exportAsZip(files, `${slug}.zip`);
        } else {
          // Fall back to CSV if no files
          exportTableToCSV(tableData, `${slug}.csv`);
        }
      },
    },
    {
      key: 'image',
      label: 'Image',
      description: 'Download image files',
      icon: <Image className="h-4 w-4 text-pink-500" />,
      action: async () => {
        const imageFiles = files.filter(f =>
          f.mimeType.startsWith('image/')
        );
        if (imageFiles.length > 0) {
          for (let i = 0; i < imageFiles.length; i++) {
            const file = imageFiles[i];
            if (i > 0) await new Promise(r => setTimeout(r, 300));
            const bytes = await file.getBytes();
            const blob = new Blob([bytes], { type: file.mimeType });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = file.name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setTimeout(() => URL.revokeObjectURL(url), 10000);
          }
        } else {
          // Export table as PNG via canvas if no image files
          exportTableToPDF(tableData, safeTitle, slug);
        }
      },
    },
  ];

  const visibleOptions = formatOptions.filter(opt => availableFormats.includes(opt.key));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={`gap-2 border-gold/40 text-gold hover:bg-gold/10 hover:text-gold ${className ?? ''}`}
          disabled={loading !== null}
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Download className="h-4 w-4" />
          )}
          {loading ? 'Exporting…' : 'Download'}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground">
          Export as…
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {visibleOptions.map(opt => (
          <DropdownMenuItem
            key={opt.key}
            disabled={loading !== null}
            onSelect={e => {
              e.preventDefault();
              handle(opt.key, opt.action);
            }}
            className="gap-3 cursor-pointer"
          >
            {loading === opt.key ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              opt.icon
            )}
            <div className="flex flex-col">
              <span className="text-sm font-medium">{opt.label}</span>
              <span className="text-xs text-muted-foreground">{opt.description}</span>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
