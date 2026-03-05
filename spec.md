# FinProLedge

## Current State

- Full-stack accounting website with Motoko backend and React/TypeScript frontend
- Admin Dashboard at `/admin` with tabs: User Approvals, Contacts, Requests, Documents, Deliverables, Client Submissions, Payments, Analytics, Settings
- Backend exposes: `listApprovals()`, `getAllRequests()`, `getAllLeads()`, `getUserProfileByPrincipal()` etc.
- Contacts tab (`ContactsTab`) currently fetches from `useListApprovals()` (approval entries) — not directly from the primary Contacts/user-profiles collection
- User Approvals tab (`ApprovalsTab`) uses `useListApprovals()` — this is correct but needs to also surface login/authentication status from the approval state
- Requests tab (`RequestsTab`) uses `useGetAllRequests()` — data is already tied to the backend service requests collection, but the tab does not reference or link to the public Services tab/module
- CSS: some text elements across the site (particularly in dark-background sections) have contrast or visibility issues; opacity may not always be explicitly set to 1 on overlaid text elements
- tailwind.config.js uses custom `navy` and `gold` color tokens

## Requested Changes (Diff)

### Add
- In `RequestsTab`: Add a visible "Service Type" filter/badge linking the displayed service type values to the same canonical service type list used in the public-facing Services section (HomePage `services` array). This makes it clear requests map 1:1 to public services.
- In `ApprovalsTab`: Alongside each approval row, show the user's authentication/login status derived from the approval record (approved = authenticated/active, pending = awaiting login activation, rejected = access revoked). Display a clear "Auth Status" column.
- In `ContactsTab`: Replace the current data source (approvals list only) with a combined query that merges `useListApprovals()` with `getAllLeads()` so the Contacts tab shows ALL contacts — both registered users and leads submitted through the public service request form. Each contact card should show available details (name, company, email, phone from profile or lead record).

### Modify
- CSS/visibility fixes across all pages and components:
  - Audit all text elements on dark backgrounds (`bg-navy`, dark sections) and ensure they use `text-white` or `text-white/80` (not `text-foreground` which maps to a dark color on light theme)
  - Audit all text on light/gold backgrounds and ensure they use `text-navy` or dark colors
  - Remove any `opacity-*` classes on text content that reduces visibility below 1 (replace with explicit color classes that include transparency in the color token itself, not via opacity)
  - Ensure `text-muted-foreground` is not used on dark solid backgrounds — replace with `text-white/60` or similar
  - In `HomePage.tsx` section 3 (Principles section — `bg-navy` background): verify all `<p>` and `<h3>` text has sufficient contrast (white or gold)
  - In `Navigation.tsx`: nav text on `bg-navy` should be `text-white/80` (already is, verify no regressions)
- `ContactsTab` data mapping: merge leads (from `getAllLeads`) and approval entries so no contacts are missed. Show "Lead" vs "Registered User" type badge per row.
- `ApprovalsTab`: Add "Auth Status" column mapping approval status to authentication meaning: pending = "Awaiting Activation", approved = "Access Granted", rejected = "Access Revoked".
- `RequestsTab`: Add a "Service Module" column or tag that maps each request's `serviceType` to the matching public service name (same label function already in the file). Add a small external link icon or tag labeling which public service page the request maps to.

### Remove
- No removals.

## Implementation Plan

1. **CSS contrast audit** — In `HomePage.tsx`, `Navigation.tsx`, `AdminDashboardPage.tsx`, `ComplianceAdminDashboardPage.tsx`, `ComplianceDashboardPage.tsx`, `AboutUsPage.tsx`, and all shared components:
   - Replace any `text-foreground` / `text-muted-foreground` on dark (`bg-navy` / dark card) backgrounds with `text-white` / `text-white/60`
   - Ensure no element has an `opacity` property set to less than 1 on text content
   - Verify section 3 (Principles) of HomePage has fully visible white/gold text

2. **Contacts tab — real-time sync with primary Contacts DB**:
   - Add `useGetAllLeads` hook that calls `getAllLeads()` from backend
   - In `ContactsTab`, merge leads array with approvals array, deduplicating by phone/name when possible
   - Show type badge: "Registered" (from approvals) vs "Lead" (from leads collection)
   - Ensure the tab auto-refreshes (same 30s interval as approvals)

3. **User Approvals tab — Auth status column**:
   - In `ApprovalRow`, add a fourth visible column "Auth Status" rendering human-readable authentication status based on `approval.status`
   - Map: `pending` → "Awaiting Activation" (yellow badge), `approved` → "Access Granted" (green badge), `rejected` → "Access Revoked" (red badge)
   - This directly links the Logins/approvals table to the auth state display

4. **Requests tab — Service module binding**:
   - The `RequestsTab` already shows `serviceTypeLabel()` — make the service type column a styled tag that visually connects to the public Services section
   - Add a small "View Service" link or tag on each row that routes to `/service-booking` with the service type pre-filtered or highlighted
   - Add a summary banner at the top of the Requests tab showing request counts grouped by service type (linking to which public service has most inquiries)
