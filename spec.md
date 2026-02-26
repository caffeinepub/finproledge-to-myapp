# Specification

## Summary
**Goal:** Add multi-format file download options for admins in the Admin Dashboard and remove two outdated marketing stats from the HomePage.

**Planned changes:**
- Add a download dropdown button to relevant admin tables (DocumentTable, AdminClientDeliverableTable, ComplianceAdminToDoList) with format options: PDF, Spreadsheet (XLSX/CSV), Document (DOCX), CSV, ZIP, and Image (PNG/JPG)
- Implement client-side file generation: CSV export from table data, ZIP bundling of selected file blobs, PDF via print/generation, and DOCX/image downloads where applicable
- Restrict the download dropdown to authenticated admin users only (AdminGuard protected)
- Remove the "99.8% filling accuracy" and "client support 24/7" stat items from the HomePage marketing/stats section
- Ensure the stats section layout remains clean after removing those two items

**User-visible outcome:** Admins can download files and table data in multiple formats directly from the Admin Dashboard. The HomePage no longer displays the removed accuracy and support stats.
