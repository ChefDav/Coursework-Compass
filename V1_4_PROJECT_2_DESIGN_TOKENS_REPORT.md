# V1.4 Project 2 Design Tokens Report

## Task name

v1.4 Personalisation Version - Project 2: Design Tokens

## Build result

`npm run build` passes.

Build summary:
- Next.js 16.2.7 with Turbopack compiled successfully.
- TypeScript completed successfully.
- Static page generation completed successfully.

## Files changed

- `app/globals.css`
- `V1_4_PROJECT_2_DESIGN_TOKENS_REPORT.md`

## Variables added

Theme-aware Coursework Compass tokens were added under `:root`, `html[data-theme="dark"]`, and `html[data-theme="light"]`:

- `--cc-bg`
- `--cc-bg-soft`
- `--cc-bg-strong`
- `--cc-panel`
- `--cc-panel-soft`
- `--cc-panel-strong`
- `--cc-card`
- `--cc-card-hover`
- `--cc-border`
- `--cc-border-strong`
- `--cc-text`
- `--cc-text-muted`
- `--cc-text-subtle`
- `--cc-accent`
- `--cc-accent-hover`
- `--cc-accent-soft`
- `--cc-success`
- `--cc-success-soft`
- `--cc-warning`
- `--cc-warning-soft`
- `--cc-danger`
- `--cc-danger-soft`
- `--cc-input-bg`
- `--cc-input-border`
- `--cc-ring`
- `--cc-shadow`
- `--cc-glow`

Existing Tailwind-facing aliases were preserved and mapped to the new theme tokens:

- `--background`
- `--foreground`

## Utility classes added

- `.cc-page`
- `.cc-page-gradient`
- `.cc-panel`
- `.cc-panel-soft`
- `.cc-panel-strong`
- `.cc-card`
- `.cc-card-hover`
- `.cc-border`
- `.cc-text-main`
- `.cc-text-muted`
- `.cc-text-subtle`
- `.cc-button-primary`
- `.cc-button-secondary`
- `.cc-button-danger`
- `.cc-input`
- `.cc-focus-ring`
- `.cc-badge`
- `.cc-badge-accent`
- `.cc-badge-success`
- `.cc-badge-warning`
- `.cc-badge-danger`
- `.cc-soft-glow`
- `.cc-grid-bg`

## What changed visually

- The `body` now uses `--cc-bg` and `--cc-text`, so the document base responds to `html[data-theme]`.
- Dark theme tokens stay close to the existing deep slate/navy, white text, slate muted text, cyan accent, emerald success, amber warning, and red danger look.
- Light theme tokens provide a clean daylight workspace using soft off-white and light slate layers, dark slate text, cyan-blue accents, and visible but soft borders.
- Existing pages were not broadly converted, so most visible UI remains driven by the current Tailwind classes until later projects adopt the new utilities.
- `.cc-date-input` now uses theme-aware text and separator colors, plus dark/light `color-scheme`, while preserving the custom cyan calendar icon behavior in `CalendarDateField`.

## What was intentionally not implemented

- No ThemeSwitcher UI was added.
- No background presets were added.
- No animations or microinteraction system was added.
- No Updates page changes were made.
- No README changes were made.
- No broad UI conversion was done across pages.
- No page redesign was done.
- No changes were made to `lib/i18n.ts`.
- No changes were made to `lib/theme.ts`.
- No changes were made to localStorage project data handling.
- No push, deploy, tag, or commit was performed.

## Manual test checklist

- [x] `npm run build` passes.
- [ ] App still loads in dark mode.
- [ ] Setting localStorage `coursework-compass-theme` to `light` and refreshing applies `data-theme="light"`.
- [ ] Setting localStorage `coursework-compass-theme` to `dark` and refreshing applies `data-theme="dark"`.
- [ ] `document.documentElement` contains theme variables such as `--cc-bg` and `--cc-text`.
- [ ] Existing language switch still works.
- [ ] Existing project data still loads.
- [ ] New Project date input still displays correctly.
- [x] No broad UI conversion was done in this task.
