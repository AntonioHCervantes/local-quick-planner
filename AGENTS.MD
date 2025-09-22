# Local Quick Planner – Agent Guide

## Purpose of this document

Use this handbook as the single source of truth when you collaborate with the
Local Quick Planner codebase. It summarizes the architecture, data flows,
quality gates, and conventions that every agent must follow to keep the project
healthy and scalable.

## How to use this guide

1. Keep this `AGENTS.MD` file at the repository root so every collaborator and
   automation tool can locate it instantly.
2. Ensure the sections remain focused on the information agents need to work
   effectively—project overview, build and test commands, code style rules,
   testing guidance, security considerations, and any other context that aids
   execution.
3. Expand the document with any extra workflow instructions a new teammate would
   need (commit message rules, pull request expectations, data handling,
   deployment steps, large assets, etc.) so the project scales smoothly as new
   contributors join.

## Project at a glance

- **Framework:** Next.js 14 (App Router) with React 18 and TypeScript in strict
  mode.
- **Styling:** Tailwind CSS (`app/globals.css` defines the base styles and
  bespoke animations). Always design for both light and dark themes.
- **State & persistence:** Global state lives in a Zustand store
  (`lib/store.ts`) that persists to `localStorage` via helper functions in
  `lib/storage.ts`.
- **Drag & drop:** Implemented with `@dnd-kit/*` inside the board components.
- **Audio & UX flourishes:** Browser-side helpers in `lib/sounds.ts` and
  components like `TaskTimerManager` trigger reminders and notifications.
- **Internationalization:** A lightweight context in `lib/i18n.tsx` exposes
  `useI18n()` with English and Spanish dictionaries.
- **Testing:** Jest + Testing Library. Prefer the custom render helper in
  `test/test-utils.tsx` so components receive the i18n provider automatically.
- **Tooling:** ESLint (`npm run lint`), Prettier (`npm run format`), TypeScript
  (`npm run typecheck`), Jest (`npm run test`). Prettier rules must always pass.

## Key directories and what lives inside them

- `app/`: App Router routes. `layout.tsx` wires global providers
  (`I18nProvider`, managers, toaster, header, footer). Feature folders include
  `my-day`, `my-tasks`, `notifications`, and static content (about, faqs,
  privacy, terms, settings).
- `components/`: UI building blocks grouped by feature. Client components must
  be marked with `'use client';` when they access hooks or browser APIs. Common
  examples include:
  - `Board`, `Column`, `TaskCard`, `TaskItem`, and `TasksView` for Kanban logic.
  - `AddTask` for task creation (supports voice input per language).
  - Managers (`TaskTimerManager`, `WorkScheduleManager`, `RecurringTaskManager`)
    that orchestrate timers, schedules, and recurring tasks outside the primary
    UI tree.
  - `ServiceWorker.tsx` to register the PWA assets in `public/`.
- `lib/`: Shared domain logic.
  - `store.ts` holds the Zustand store, migrations, and all state mutations.
  - `types.ts` defines the persisted models (`Task`, `List`, `Tag`,
    `PersistedState`, `Notification`, scheduling types, etc.).
  - `storage.ts` abstracts saving/loading from `localStorage`.
  - `dayStatus.ts`, `tagColors.ts`, `sounds.ts`, and `i18n.tsx` provide UI
    helpers.
  - `__tests__/` contains unit tests for store logic.
- `public/`: Static assets, PWA manifest, offline fallback, and `sw.js` service
  worker. Update `APP_SHELL` when new critical routes should be cached offline.
- `test/`: Shared Testing Library utilities.

## Data model & store guidelines

The Zustand store in `lib/store.ts` is the heart of the app. When you modify or
extend persisted data, **update every layer consistently**:

1. Add new fields to `lib/types.ts` and adapt the `PersistedState` interface.
2. Expand `defaultState` so fresh installs have sane defaults.
3. Bump the `version` inside `defaultState` and add migration steps in the
   `persisted` bootstrapping block so older states upgrade cleanly (use the
   sanitizer helpers like `sanitizeWorkSchedule`, `sanitizeTaskRepeat`, etc.).
4. Adjust actions (`addTask`, `moveTask`, timers, scheduling helpers, etc.) so
   they keep `state.order`, `timers`, and related maps consistent.
5. Keep export/import/reset flows in sync:
   - `exportData` serializes the live store.
   - `importData` merges with `defaultState` and sanitizers—validate new fields
     there.
   - `clearAll` must reset every property.
6. Update tests in `lib/__tests__` (or add new ones) to cover new behaviors,
   especially for migrations, recurring tasks, timers, and work schedules.
7. Every store mutation must call `saveState(get())` (or equivalent) so
   persistence stays aligned.

Never access `localStorage` directly from new code—go through the store or the
existing helpers so SSR remains safe.

## UI, UX, and accessibility conventions

- Use Tailwind utility classes; keep custom CSS inside `app/globals.css` when
  necessary.
- Ensure components remain responsive across breakpoints (the layout relies on
  flexbox and overflow utilities).
- Support both themes. If you introduce new colors, make sure they work on light
  and dark backgrounds.
- Favor semantic HTML (labels for inputs, buttons for actions, `aria-*`
  attributes where appropriate). Follow the patterns already used in components
  like `AddTask`, `TaskCard`, and `NotificationCard`.
- Prefer small, composable client components. If a component only renders static
  content, keep it server-side (no `'use client';`).
- When introducing new actions or notifications, surface them through the store
  so `TaskTimerManager`, `RecurringTaskManager`, and `WorkScheduleManager` can
  react appropriately.

## Internationalization requirements

All user-facing strings must come from `useI18n()`:

- Add new keys to both `en` and `es` dictionaries in `lib/i18n.tsx`. Maintain
  the existing nested structure so translations stay organized.
- Update any tests that rely on string literals—prefer translation keys via the
  `t()` helper.
- Remember that `I18nProvider` stores the language in `localStorage`; do not
  introduce blocking SSR logic.

## Notifications, timers, and recurring tasks

- `TaskTimerManager` polls the store every second. Ensure timers always include
  `duration`, `remaining`, `running`, and `endsAt` so the manager can send
  completion notifications and sounds.
- `RecurringTaskManager` and `applyRecurringTasksForToday()` use the work
  schedule and repeat metadata to auto-populate My Day. Preserve the ordering
  logic that uses task priority.
- When adding new notification types, provide `titleKey` and `descriptionKey`
  plus optional translated fallbacks so the Notifications page renders
  correctly.

## Testing & quality gates

Run the full suite before requesting a review:

- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run format` (or `npm run format -- --check` if available) to ensure
  Prettier compliance.

Add or update Jest tests alongside your changes:

- Component tests belong next to the component (see
  `components/Link/__tests__/Link.test.tsx`).
- Store/unit tests live in `lib/__tests__`.
- Use `test/test-utils.tsx`’s `render` helper so the i18n provider is present.

## Workflow expectations

- Follow the [Conventional Commits](https://www.conventionalcommits.org/) style
  described in `CONTRIBUTING.md`.
- Create branches with **English names** (e.g., `feature/add-calendar-view`).
- Keep pull request descriptions clear and concise; do **not** label PRs with
  `codex`.
- Keep the Git worktree clean—commit all relevant files and ensure no leftover
  generated artifacts remain.
- Align with the existing code formatting; never disable ESLint or Prettier
  rules without project-owner approval.

## When adding new routes or assets

- Register new pages under `app/` and expose navigation via the Header or other
  relevant components.
- Update the service worker (`public/sw.js`) `APP_SHELL` array and, if needed,
  the manifest (`public/manifest.webmanifest`) so offline caching works.
- Provide fallback content or guards for browser-only APIs (`window`,
  `navigator`, `crypto`, audio contexts). All existing helpers check for browser
  availability—mirror that approach.

Following these guidelines ensures every agent contributes changes that
integrate smoothly with Local Quick Planner’s architecture and long-term vision.
