# Local Quick Planner – Agent Quick Guide

## Project overview
- Personal planner, local-first PWA, fully offline, no backend or env vars.

## Build and test commands
- Install dependencies: `npm install`
- Run dev server: `npm run dev`
- Build for production: `npm run build`
- Execute tests: `npm run test`

## Code style guidelines
- Write TypeScript and follow ESLint + Prettier (Tailwind plugin included); keep formatting clean and adhere to Conventional Commits.

## Testing instructions
- Run `npm run test` for unit/component coverage with Jest + Testing Library; ensure key views render, drag-and-drop flows work, and basic accessibility expectations hold.

## Security considerations
- Persist only local data (localStorage), never add backend calls, env vars, or tracking; avoid leaking personal information and follow general client-side security hygiene.

## Branch / PR / Commit strategy
- Branches: English kebab-case with prefixes (`feature/`, `bugfix/`, `hotfix/`, `docs/`); optionally prepend issue IDs (e.g., `feature/123-natural-language-input`).
- Flow: branch from `main`, keep changes small, rebase/merge with `main` often.
- PRs: one goal per PR with clear title + brief why/what, reference related issue (`#123`), use Draft for WIP, prefer Squash & merge and auto-delete branch.
- Commits: follow Conventional Commits (`feat:`, `fix:`, `docs:`, `refactor:`...), imperative and concise; include `BREAKING CHANGE:` footer if necessary.
- Protection: never commit directly to `main`; land changes via PR with required checks/reviews.
