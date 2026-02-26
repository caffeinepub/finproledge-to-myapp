# Specification

## Summary
**Goal:** Fix admin portal access so that the user `finproledge@gmail.com` can successfully log in and reach the Admin Dashboard.

**Planned changes:**
- Update the `AdminGuard` component to include `finproledge@gmail.com` as an authorized admin in the email-based override check
- Update the Navigation component so the admin tab/link is visible when `finproledge@gmail.com` is authenticated
- Update the backend role logic to return an admin role for the principal associated with `finproledge@gmail.com`

**User-visible outcome:** The user `finproledge@gmail.com` can log in via Internet Identity and access the Admin Dashboard without encountering an access-denied or login prompt screen. All other non-admin users remain denied access.
