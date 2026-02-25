# Specification

## Summary
**Goal:** Restrict admin access in both the frontend and backend exclusively to the email address finproledge@gmail.com.

**Planned changes:**
- Update `AdminGuard` component to only grant admin access when the authenticated user's email exactly matches `finproledge@gmail.com`, showing an "Access Denied" state for all other users.
- Update `Navigation.tsx` so admin navigation links are only visible to the user with email `finproledge@gmail.com`.
- Ensure the `isCallerAdmin` check across frontend components is consistent with the `finproledge@gmail.com` restriction.
- Update backend admin authorization logic so that only the principal associated with `finproledge@gmail.com` is recognized as admin, and all admin-gated methods reject any other caller.

**User-visible outcome:** Only the user logged in with finproledge@gmail.com can access admin pages and see admin navigation links; all other authenticated users see an "Access Denied" message on admin routes.
