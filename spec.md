# TapIt ID

## Current State
- Full digital business card platform with profile creation/editing, shareable link, and QR code.
- Share Back button exists on ProfileCardPage for non-owner visitors; submissions are stored in the backend via `submitShareBack(ownerPhone, input)`.
- Backend exposes `getShareBacks(ownerPhone): Promise<Array<ShareBack>>` where `ShareBack` has `{ name, email, phone, message, timestamp }`.
- No UI exists to view Share Back submissions.
- App has pages: home, create, view (ProfileCardPage), edit.

## Requested Changes (Diff)

### Add
- `ShareBackDashboardPage` component: A new page where the logged-in card owner can see all Share Back submissions they have received.
  - Requires Internet Identity login. If not logged in, show a prompt.
  - Fetches `getShareBacks(phone)` using the owner's phone number.
  - Displays submissions as a list of cards: Name, email, phone, message, timestamp.
  - Shows empty state if no submissions yet.
  - Loading skeleton while fetching.
  - Navigation back to the owner's card.
- Navigation: Add a new `{ type: 'dashboard'; phone: string }` page type in App.tsx.
- In `ProfileCardPage`, for card owners, add a "View Connections" (or "Share Back Inbox") button/link that navigates to the dashboard.

### Modify
- `App.tsx`: Add `dashboard` to the `Page` union type and render `ShareBackDashboardPage` when active.
- `ProfileCardPage`: Add a dashboard navigation link for owners below the "Share Your Card" panel.

### Remove
- Nothing removed.

## Implementation Plan
1. Create `src/frontend/src/pages/ShareBackDashboardPage.tsx` with full UI: header nav, loading skeletons, empty state, submission cards list.
2. Modify `App.tsx` to include the `dashboard` page type and render the new page.
3. Modify `ProfileCardPage.tsx` to add a "View Connections" button for owners that navigates to the dashboard.
