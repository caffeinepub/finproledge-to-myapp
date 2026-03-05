import type { ExternalBlob } from "../backend";

/**
 * Downloads a file from an ExternalBlob with the given filename and MIME type.
 */
export async function downloadExternalBlob(
  blob: ExternalBlob,
  filename: string,
  mimeType = "application/octet-stream",
): Promise<void> {
  try {
    const bytes = await blob.getBytes();
    const fileBlob = new Blob([bytes], { type: mimeType });
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
