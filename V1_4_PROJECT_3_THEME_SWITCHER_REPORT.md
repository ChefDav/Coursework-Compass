# v1.4 Project 3 ThemeSwitcher UI Report

## Task name

v1.4 Personalisation Version - Project 3: ThemeSwitcher UI

## Build result

Passed. `npm run build` completed successfully with Next.js 16.2.7.

## Files changed

- `components/ThemeSwitcher.tsx`
- `components/AppNav.tsx`
- `V1_4_PROJECT_3_THEME_SWITCHER_REPORT.md`

## Component added

- Added `ThemeSwitcher`, a client component with a compact segmented control for dark and light theme selection.
- Uses the existing theme helpers from `lib/theme.ts`.
- Uses the existing language helpers from `lib/i18n.ts`.
- Supports English labels: Theme, Dark, Light.
- Supports Chinese labels: 主题, 深色, 浅色.

## Where ThemeSwitcher was integrated

- Desktop AppNav preference controls, placed next to `LanguageSwitcher`.
- Mobile AppNav menu, placed next to `LanguageSwitcher compact`.

## What was intentionally not implemented

- No full page light-theme conversion.
- No global UI redesign.
- No background presets.
- No animations.
- No Updates page changes.
- No README changes.
- No push, deploy, tag, or commit.
- No changes to localStorage project data handling.

## Manual test checklist

- [x] `npm run build` passes
- [ ] AppNav shows ThemeSwitcher on desktop
- [ ] AppNav shows ThemeSwitcher in mobile menu
- [ ] Clicking Light sets localStorage `coursework-compass-theme` to `light`
- [ ] Clicking Dark sets localStorage `coursework-compass-theme` to `dark`
- [ ] `document.documentElement.dataset.theme` changes immediately
- [ ] Refresh keeps the selected theme
- [ ] Language switch still works
- [ ] ThemeSwitcher labels change between English and Chinese
- [ ] Existing project data still loads
- [ ] No full page light-theme conversion was done in this task
