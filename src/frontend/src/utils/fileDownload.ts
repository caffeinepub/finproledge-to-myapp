import type { ExternalBlob } from "../backend";

/**
 * Downloads a file from an ExternalBlob with the given filename and MIME type.
 * The file is saved to disk with the original filename and extension preserved.
 */
export async function downloadExternalBlob(
  blob: ExternalBlob,
  filename: string,
  mimeType = "application/octet-stream",
): Promise<void> {
  try {
    const bytes = await blob.getBytes();
    // Always derive the MIME type from the filename extension if the caller
    // passed the generic fallback, so the OS opens the file correctly.
    const resolvedMime =
      mimeType === "application/octet-stream"
        ? getMimeTypeFromFilename(filename)
        : mimeType;
    const fileBlob = new Blob([bytes], { type: resolvedMime });
    const url = URL.createObjectURL(fileBlob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Download failed:", error);
    throw error;
  }
}

/**
 * Opens a file from an ExternalBlob in a new browser tab in its original format.
 * PDFs open in the browser PDF viewer, images render directly, etc.
 * Falls back to a forced download for binary formats (DOCX, XLSX, ZIP, CSV).
 */
export async function openExternalBlobInOriginalFormat(
  blob: ExternalBlob,
  filename: string,
): Promise<void> {
  const mimeType = getMimeTypeFromFilename(filename);

  // These types can be viewed natively in the browser — open in a new tab.
  const inBrowserViewable = [
    "application/pdf",
    "image/png",
    "image/jpeg",
    "image/gif",
    "image/webp",
    "image/svg+xml",
    "text/plain",
    "text/csv",
  ];

  try {
    const bytes = await blob.getBytes();
    const fileBlob = new Blob([bytes], { type: mimeType });
    const url = URL.createObjectURL(fileBlob);

    if (inBrowserViewable.includes(mimeType)) {
      // Open in new tab so the browser renders it natively.
      const tab = window.open(url, "_blank");
      if (!tab) {
        // Pop-up blocked — fall back to download.
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
      // Delay revoke so the tab has time to load the blob URL.
      setTimeout(() => URL.revokeObjectURL(url), 30_000);
    } else {
      // For office/zip/binary files, trigger a download with the correct
      // extension so the OS opens them in the right application.
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error("Open in original format failed:", error);
    throw error;
  }
}

/**
 * Derives a MIME type from a filename extension.
 */
export function getMimeTypeFromFilename(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const mimeMap: Record<string, string> = {
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    csv: "text/csv",
    txt: "text/plain",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    zip: "application/zip",
    json: "application/json",
  };
  return mimeMap[ext] ?? "application/octet-stream";
}
