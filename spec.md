# Specification

## Summary
**Goal:** Fix admin portal access so that the user with email finproledge@gmail.com can reliably access the admin portal without being blocked or redirected.

**Planned changes:**
- Update `AdminGuard` component to correctly identify finproledge@gmail.com as an admin during the email-verification fallback path
- Update the Navigation component to show admin-only links (e.g., Admin Dashboard) when logged in as finproledge@gmail.com
- Fix the backend role-check logic in `backend/main.mo` so the principal linked to finproledge@gmail.com is recognized as an admin by the `isAdmin` (or equivalent) function
- Ensure non-admin users remain blocked by AdminGuard and hidden from admin navigation links

**User-visible outcome:** The user finproledge@gmail.com can log in and access the full admin portal (service requests, documents, approvals, payments, deliverables, analytics) and see admin navigation links, while all other non-admin users remain restricted as before.
