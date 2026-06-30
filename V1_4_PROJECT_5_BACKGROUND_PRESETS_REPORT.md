# V1.4 Project 5 Background Presets Report

## Task name

Project 5: Background Presets

## Build result

`npm run build` passes.

Build summary:

- Next.js 16.2.7 with Turbopack
- Production build compiled successfully
- TypeScript completed successfully
- Static pages generated successfully

## Files changed

- `lib/background.ts`
- `components/BackgroundBootstrap.tsx`
- `components/BackgroundSwitcher.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `app/dashboard/page.tsx`
- `V1_4_PROJECT_5_BACKGROUND_PRESETS_REPORT.md`

## Storage key

`coursework-compass-background`

## Event name

`coursework-compass-background-changed`

## Presets added

- `default` - Default Nebula / 默认星云
- `deep-ocean` - Deep Ocean / 深海蓝
- `paper-light` - Paper Light / 白昼纸张
- `aurora` - Aurora / 极光
- `minimal-slate` - Minimal Slate / 极简灰蓝
- `exam-focus` - Exam Focus / 考试专注

## Where BackgroundSwitcher was placed

`BackgroundSwitcher` was added to the Dashboard page below the main dashboard intro card and above the dashboard project/stat content.

Route:

- `/dashboard`

Section labels:

- English: Personalise workspace
- Chinese: 个性化学习空间

## What was intentionally not implemented

- No image upload
- No cloud storage
- No full settings page
- No animation system
- No task completion microinteractions
- No Updates page changes
- No README changes
- No push, deploy, tag, or commit

## Manual test checklist

- [x] `npm run build` passes
- [ ] `/dashboard` loads
- [ ] BackgroundSwitcher appears on Dashboard
- [ ] BackgroundSwitcher labels are English in English mode
- [ ] BackgroundSwitcher labels are Chinese in Chinese mode
- [ ] Selecting each preset updates `document.documentElement.dataset.background`
- [ ] Selecting each preset saves localStorage `coursework-compass-background`
- [ ] Refresh keeps the selected background
- [ ] Dark theme + each background remains readable
- [ ] Light theme + each background remains readable
- [ ] ThemeSwitcher still works
- [ ] LanguageSwitcher still works
- [ ] Existing project data still loads
- [ ] New Project still generates and saves
- [ ] No image upload was added
- [ ] No cloud storage was added

## Risks or visual QA notes

- The background system is intentionally browser-local and does not affect saved project/task data.
- The preset CSS uses the existing `cc-page-gradient` and `cc-page` classes, so pages using those classes inherit the chosen atmosphere automatically.
- Light theme has targeted overrides for Paper Light, Minimal Slate, and Exam Focus to keep text readable and calm.
- Dark theme Paper Light remains a warm dark atmosphere rather than forcing a light page while the app is in dark mode.
- Final visual QA should still be done in-browser across both themes because the presets are deliberately subtle and readability depends on surrounding cards.
