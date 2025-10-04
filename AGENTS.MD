# CheckPlanner – Agent Quick Guide

## Project overview
- Personal planner, local-first PWA, fully offline, no backend or env vars.

## Build and test commands
- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Build for production: `npm run build`
- Execute tests: `npm run test`

## Quality gates (must pass)
- Lint (sin warnings)
- Typecheck
- Tests
- Build

If any of these fail, do not open or update a PR. Fix first.

## Code style guidelines
- Write TypeScript and follow ESLint + Prettier (Tailwind plugin included); keep formatting clean and adhere to Conventional Commits.

## Testing instructions
- Run `npm run test` for unit/component coverage with Jest + Testing Library; ensure key views render, drag-and-drop flows work, and basic accessibility expectations hold.

## Security considerations
- Persist only local data (localStorage), never add backend calls, env vars, or tracking; avoid leaking personal information and follow general client-side security hygiene.

## Branch / PR / Commit strategy
- Branches: English kebab-case with prefixes (`feature/`, `bugfix/`, `hotfix/`, `docs/`); optionally prepend issue IDs (e.g., `feature/123-natural-language-input`).
- Flow: branch from `main`, keep PRs focused and small, and avoid direct commits to `main`.
- PRs: follow Conventional Commit messaging, include clear summaries with referenced issues, prefer Squash & merge, and attach UI screenshots when you change the interface.
- Reviews: use Draft for WIP, rebase/merge with `main` often, and ensure required checks pass before requesting review.

Agents must adhere to these rules.
