# Specification

## Summary
**Goal:** Fix approvals data mapping, resolve file corruption in the upload/download workflow, and add a filter bar to the Documents view in FinProLedge.

**Planned changes:**
- Audit and fix the approvals data mapping in the Admin Dashboard: ensure all fields (including nested objects like client profile info, status, and timestamps) from the `listApprovals` query are fully destructured and rendered without truncation.
- Fix the file upload pipeline for Deliverables and To-Dos in `ClientDeliverableForm.tsx`, `CreateToDoForm.tsx`, and `ClientCreateToDoForm.tsx` so files are read and stored as `ArrayBuffer`/`Uint8Array` with correct Blob types and no encoding corruption.
- Fix the admin-side download/reconstruction logic in `DocumentTable.tsx`, `ComplianceAdminToDoList.tsx`, and related download utilities to preserve the original MIME type and byte sequence.
- Add a persistent filter bar above the documents table in both the Admin Dashboard Documents tab and the Client Portal Documents tab, supporting: document type (dropdown/multi-select), upload date range (from/to date pickers), and document name (free-text search).
- Add sort controls to the Documents view for sorting by upload date (ascending/descending) and document name (A–Z / Z–A), applied reactively without a separate submit action.

**User-visible outcome:** Admins see a complete, untruncated list of all approval entries with full detail fields. Files uploaded by clients through Deliverables or To-Dos are received and downloadable by admins in their original, uncorrupted format. Both admins and clients can filter and sort the Documents list by type, date range, and name in real time.
