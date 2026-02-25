# Specification

## Summary
**Goal:** Remove the Deadline feature, enable admin status control over compliance tasks, fix document download format preservation, expand compliance deliverable permissions for both clients and admins, and apply several UI text and form updates across the FINPROLEDGE Portal.

**Planned changes:**
- Remove the Deadline tab and all deadline-related UI components from both the client and admin compliance dashboards; remove deadline CRUD backend methods while preserving migration data if needed
- Allow admins to change statuses of To-Dos, Timelines, and Follow-Ups directly from the admin compliance dashboard using inline status selectors; authorize admin principal for existing status update backend methods
- Ensure documents uploaded by clients are downloaded by admins in their original file format and with their original filename, preserving MIME type and Content-Disposition headers
- Allow both clients and admins to add Compliance Deliverables and approve or reject them; add an admin-side deliverable creation form and authorize both principals in the backend for submit and status update operations
- Display a view/download link for uploaded documents in each row of the AdminClientDeliverableTable in the Client Submitted Deliverables tab
- Replace all occurrences of "Join Us as a Client Today" with "Contact Us" throughout the frontend
- Make the Phone Number field non-mandatory in the ServiceRequestForm, VisitorServiceRequestPage form, and UserProfileSetup modal

**User-visible outcome:** Admins can manage compliance task statuses, create and approve/reject deliverables, and download uploaded documents in their original format. The Deadline feature is gone from all views. Clients no longer need to enter a phone number, and the "Contact Us" label appears consistently in place of the previous CTA text.
