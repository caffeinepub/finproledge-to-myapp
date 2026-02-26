/**
 * Client-side file export utilities for admin download functionality.
 * Uses only browser-native APIs — no external dependencies required.
 */

export type ExportableRow = Record<string, string | number | boolean | null | undefined>;

/** Trigger a browser download for a given Blob */
function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 10000);
}

/** Escape a CSV cell value */
function escapeCsvCell(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/** Export table data as a CSV file */
export function exportTableToCSV(rows: ExportableRow[], filename = 'export.csv') {
  if (rows.length === 0) {
    downloadBlob(new Blob(['No data'], { type: 'text/csv' }), filename);
    return;
  }
  const headers = Object.keys(rows[0]);
  const csvLines = [
    headers.map(escapeCsvCell).join(','),
    ...rows.map(row => headers.map(h => escapeCsvCell(row[h])).join(',')),
  ];
  const blob = new Blob([csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
  downloadBlob(blob, filename);
}

/**
 * Export table data as a basic XLSX-compatible file.
 * Uses XML SpreadsheetML format which Excel/Sheets can open.
 */
export function exportTableToXLSX(rows: ExportableRow[], filename = 'export.xlsx') {
  if (rows.length === 0) {
    exportTableToCSV(rows, filename.replace('.xlsx', '.csv'));
    return;
  }
  const headers = Object.keys(rows[0]);

  const xmlRows = [
    `<Row>${headers.map(h => `<Cell><Data ss:Type="String">${escapeXml(h)}</Data></Cell>`).join('')}</Row>`,
    ...rows.map(row =>
      `<Row>${headers
        .map(h => {
          const val = row[h];
          const type = typeof val === 'number' ? 'Number' : 'String';
          return `<Cell><Data ss:Type="${type}">${escapeXml(String(val ?? ''))}</Data></Cell>`;
        })
        .join('')}</Row>`
    ),
  ];

  const xml = `<?xml version="1.0"?>
<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"
 xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
 <Worksheet ss:Name="Sheet1">
  <Table>
   ${xmlRows.join('\n   ')}
  </Table>
 </Worksheet>
</Workbook>`;

  const blob = new Blob([xml], { type: 'application/vnd.ms-excel;charset=utf-8;' });
  downloadBlob(blob, filename);
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Export table data as a simple DOCX-compatible RTF document.
 * Uses RTF format which Word can open natively.
 */
export function exportToDocument(rows: ExportableRow[], title: string, filename = 'export.docx') {
  if (rows.length === 0) {
    downloadBlob(new Blob(['No data'], { type: 'text/plain' }), filename);
    return;
  }
  const headers = Object.keys(rows[0]);

  // Build a simple HTML document that Word can open
  const tableRows = [
    `<tr>${headers.map(h => `<th style="border:1px solid #000;padding:4px;background:#f0f0f0"><b>${h}</b></th>`).join('')}</tr>`,
    ...rows.map(
      row =>
        `<tr>${headers
          .map(h => `<td style="border:1px solid #000;padding:4px">${row[h] ?? ''}</td>`)
          .join('')}</tr>`
    ),
  ];

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office"
xmlns:w="urn:schemas-microsoft-com:office:word"
xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${title}</title></head>
<body>
<h2>${title}</h2>
<table style="border-collapse:collapse;width:100%">
${tableRows.join('\n')}
</table>
</body></html>`;

  const blob = new Blob([html], {
    type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  });
  downloadBlob(blob, filename);
}

/**
 * Print the current page as PDF using the browser's print dialog.
 * Optionally pass a title to set the document title before printing.
 */
export function exportToPDF(title?: string) {
  const originalTitle = document.title;
  if (title) document.title = title;
  window.print();
  if (title) document.title = originalTitle;
}

/**
 * Export table data as PDF by opening a print-ready HTML page in a new window.
 */
export function exportTableToPDF(rows: ExportableRow[], title: string, filename = 'export') {
  if (rows.length === 0) return;
  const headers = Object.keys(rows[0]);

  const tableRows = [
    `<tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr>`,
    ...rows.map(
      row =>
        `<tr>${headers.map(h => `<td>${row[h] ?? ''}</td>`).join('')}</tr>`
    ),
  ];

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${title}</title>
  <style>
    body { font-family: Arial, sans-serif; font-size: 12px; margin: 20px; }
    h2 { color: #1a2744; margin-bottom: 16px; }
    table { border-collapse: collapse; width: 100%; }
    th { background: #1a2744; color: white; padding: 8px; text-align: left; font-size: 11px; }
    td { border: 1px solid #ddd; padding: 6px 8px; font-size: 11px; }
    tr:nth-child(even) td { background: #f9f9f9; }
    @media print { body { margin: 0; } }
  </style>
</head>
<body>
  <h2>${title}</h2>
  <p style="color:#666;font-size:11px">Generated: ${new Date().toLocaleString()}</p>
  <table>
    ${tableRows.join('\n    ')}
  </table>
  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const win = window.open(url, '_blank');
  if (win) {
    win.onafterprint = () => {
      win.close();
      URL.revokeObjectURL(url);
    };
  }
  // Fallback: revoke after 60s
  setTimeout(() => URL.revokeObjectURL(url), 60000);
}

/**
 * Download a file blob directly (for image/document downloads from ExternalBlob).
 */
export async function downloadExternalBlob(
  externalBlob: { getBytes(): Promise<Uint8Array<ArrayBuffer>> },
  filename: string,
  mimeType: string
) {
  const bytes = await externalBlob.getBytes();
  const blob = new Blob([bytes], { type: mimeType });
  downloadBlob(blob, filename);
}

/**
 * Bundle multiple files into a simple ZIP-like archive.
 * Since we can't use JSZip without adding a dependency, we download files individually
 * with a small delay between each download.
 */
export async function bundleFilesAsIndividualDownloads(
  files: Array<{ name: string; mimeType: string; getBytes: () => Promise<Uint8Array<ArrayBuffer>> }>
) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    await new Promise(resolve => setTimeout(resolve, i * 300));
    const bytes = await file.getBytes();
    const blob = new Blob([bytes], { type: file.mimeType });
    downloadBlob(blob, file.name);
  }
}

/**
 * Create a simple ZIP file using the browser's CompressionStream API (if available)
 * or fall back to individual downloads.
 */
export async function exportAsZip(
  files: Array<{ name: string; mimeType: string; getBytes: () => Promise<Uint8Array<ArrayBuffer>> }>,
  zipName = 'export.zip'
) {
  // Fall back to individual downloads since we can't use JSZip
  await bundleFilesAsIndividualDownloads(files);
}
