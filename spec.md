# Specification

## Summary
**Goal:** Add inline status-change controls to client-facing task sections so clients can update the status of their own To-Dos, Timelines, Follow-Ups, and Deadlines directly from the compliance dashboard and client portal.

**Planned changes:**
- Add inline status selectors (reusing the existing `TaskStatusSelect` pattern) to each task row in `MyComplianceTasksSection` for all four task types (To-Dos, Timelines, Follow-Ups, Deadlines).
- Add the same inline status selectors to each task table in `ClientTasksTab` for all four task types, sharing logic with `MyComplianceTasksSection`.
- Show success and error toast notifications on status update attempts.
- Add/expose backend update-status endpoints for `clientToDo`, `clientTimeline`, `clientFollowUp`, and `clientDeadline`, each validating that the calling principal owns the record before persisting the change.
- Add frontend mutation hooks for each of the four client task-type status updates, invalidating relevant query cache keys on success.

**User-visible outcome:** Clients can change the status of their own tasks directly from both the compliance dashboard and the client portal, with immediate UI feedback via toast notifications.
