# Specification

## Summary
**Goal:** Enable clients to view and self-create To-Dos, Timeline entries, Follow-Ups, and Deadlines assigned to them by admins or created by themselves, while admins retain the ability to assign items to specific clients.

**Planned changes:**
- Extend backend data models (ToDoItem, TimelineEntry, FollowUpItem, DeadlineRecord) to consistently include an optional `clientPrincipal` field
- Add backend query functions `getMyToDos`, `getMyTimelines`, `getMyFollowUps`, and `getMyDeadlines` that return only records belonging to the authenticated caller
- Add backend mutation functions `createClientToDo`, `createClientTimeline`, `createClientFollowUp`, and `createClientDeadline` for authenticated clients to create their own items
- Create a `useClientCompliance` hook exposing React Query hooks for the new query and mutation functions, with cache invalidation on mutation success
- Add a "Tasks & Deadlines" tab to the client-facing ComplianceDashboardPage with four sections (To-Dos, Timeline, Follow-Ups, Deadlines), each showing assigned/self-created items with loading skeletons and empty states
- Add an "Add" button in each section of the client-facing tab that opens a simplified form dialog (without the client principal selector) for self-creating items
- Ensure all four admin create forms (ToDoForm, TimelineForm, FollowUpForm, DeadlineForm) have an optional "Assign to Client (Principal)" input field
- Add a migration module (`backend/migration.mo`) to set `clientPrincipal` to null on all pre-existing records

**User-visible outcome:** Clients can log in and see a "Tasks & Deadlines" tab on their compliance dashboard showing items assigned to them by admins as well as items they created themselves, and can add new To-Dos, Timeline entries, Follow-Ups, and Deadlines directly. Admins can optionally assign any newly created item to a specific client principal.
