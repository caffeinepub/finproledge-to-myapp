# Specification

## Summary
**Goal:** Fix Admin Tab save errors, enrich Principal ID display with company details, and add sortable/filterable table headers on the Compliance Deliverables page.

**Planned changes:**
- Fix bugs in the Admin Tab where creating a new To-Do, Timeline, or Follow-Up item throws a "Something went wrong!" error; ensure all three creation flows complete successfully and new items appear in their lists after saving.
- In all admin-facing views that display a Principal ID (e.g., ComplianceAdminToDoList, ComplianceAdminTimeline, ComplianceAdminFollowUp, AdminClientDeliverableTable), also resolve and display the client's Company Name and Registered Name alongside the Principal ID, with graceful fallback if the profile cannot be resolved.
- On the Client Documents & Compliance Deliverables page (AdminClientDeliverableTable), make all column headers clickable to toggle ascending/descending sort with a visual sort-direction indicator, and add per-column filter inputs or dropdowns that update the table in real time; existing row actions (approve, reject, download) remain functional.

**User-visible outcome:** Admins can successfully create To-Do, Timeline, and Follow-Up items without errors. All admin tables now show the client's Company Name and Registered Name next to their Principal ID. The Compliance Deliverables table supports sorting and filtering on every column for easier management.
