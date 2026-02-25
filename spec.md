# Specification

## Summary
**Goal:** Allow authenticated clients to upload their own documents in the Client Portal, and display login details (principal ID and email) for each approval requester in the Admin Dashboard's Client Approval tab.

**Planned changes:**
- Add a document upload form (file selector + document type selector + submit button) to the Client Portal's documents tab, using the existing `uploadDocument` mutation from `useDocuments`
- Display upload errors in the client portal upload UI
- Extend the backend to accept caller-initiated document uploads (name, type, blob), storing them associated with the caller's principal
- In the Admin Dashboard's Client Approval tab, show each requester's principal ID and registered email address alongside existing approve/reject controls
- Add or expose a backend query function to fetch a `UserProfile` by principal, callable by the admin

**User-visible outcome:** Clients can upload documents directly from their portal and see them appear immediately in their documents list. Admins can see the principal ID and email of each client requesting approval in the Client Approval tab.
