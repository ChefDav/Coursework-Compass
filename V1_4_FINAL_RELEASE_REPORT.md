# v1.4 Final Release Report

## 1. Release Name

v1.4 Personalisation Version

Chinese release name: v1.4 个性化版本

## 2. Build Result

`npm run build` passes.

Build completed successfully with Next.js 16.2.7 and generated the app routes:

- `/`
- `/_not-found`
- `/dashboard`
- `/projects`
- `/projects/[projectId]`
- `/projects/new`
- `/test`
- `/today`
- `/updates`

## 3. Files Changed

- `app/layout.tsx`
- `app/page.tsx`
- `app/test/page.tsx`
- `app/updates/page.tsx`
- `components/FeedbackPanel.tsx`
- `components/OnboardingPopup.tsx`
- `components/TestingGuideCard.tsx`
- `lib/i18n.ts`
- `README.md`
- `V1_4_FINAL_RELEASE_REPORT.md`

## 4. Updates Page Changes

- Added v1.4 as the newest release entry above v1.3 and older releases.
- Updated the current release hero to `v1.4 Personalisation Version`.
- Added the Chinese current release title `v1.4 个性化版本`.
- Added the v1.4 English and Simplified Chinese release summaries.
- Added the v1.4 highlight bullets for themes, saved preferences, background presets, UI refinement, motion polish, task completion microinteractions, Personalisation Panel, bilingual support, and browser-only beta storage.

## 5. Current Version Labels Updated

- App navigation label now uses v1.4 through `lib/i18n.ts`.
- Beta notice copy and badge now use `v1.4 beta` / `v1.4 测试版`.
- Landing page version badge and feature note now use v1.4.
- Onboarding visible release badge now uses v1.4.
- Testing guide current beta note now uses v1.4.
- Guided `/test` tutorial version badge now uses v1.4.
- Feedback email subject and intro now use v1.4.
- README current version now uses v1.4.

## 6. README Changes

- Updated current version to `v1.4 Personalisation Version`.
- Refreshed the short product description.
- Updated key features to include local-first planning, Dashboard / Projects / Today / Project Detail, New Project Studio, 11 templates, bilingual interface foundation, dark/light themes, saved preferences, background presets, Personalisation Panel, motion polish, task completion feedback, and browser localStorage beta.
- Kept the tech stack concise.
- Added the beta testing note for browser-only data and preferences.
- Kept setup commands: `npm install`, `npm run dev`, and `npm run build`.

## 7. Metadata Changes

- Updated `app/layout.tsx` metadata description to a stable v1.4-compatible description focused on local-first planning, bilingual UI, saved preferences, and personalisation features.

## 8. What Was Intentionally Preserved

- Existing v1.3, v1.2, v1.1, and v1.0 update history.
- Historical release names and version numbers.
- Existing project and task localStorage data model.
- Existing project generation logic.
- Existing task editing logic.
- Existing ThemeSwitcher, BackgroundSwitcher, PersonalisationPanel, theme, background, and i18n structure.
- Existing bilingual UI foundation.

## 9. What Was Intentionally Not Implemented

- No new product features.
- No UI redesign.
- No cloud storage.
- No authentication.
- No AI features.
- No analytics.
- No Calendar View.
- No PDF export.
- No push, deploy, tag, or commit.

## 10. Manual Release Checklist

Build:
- [ ] `npm run build` passes

Version:
- [ ] AppNav or visible site chrome shows v1.4 where appropriate
- [ ] BetaNotice or onboarding does not still claim v1.3 as current
- [ ] Updates page shows v1.4 as newest entry
- [ ] Older update history is preserved
- [ ] README says current version is v1.4 Personalisation Version

Pages:
- [ ] `/` loads
- [ ] `/dashboard` loads
- [ ] `/projects` loads
- [ ] `/projects/new` loads
- [ ] `/today` loads
- [ ] `/updates` loads
- [ ] `/test` loads

Core workflows:
- [ ] New Project can generate a plan
- [ ] New Project can save locally
- [ ] Saved project opens correctly
- [ ] Dashboard shows saved project
- [ ] Projects page shows saved project
- [ ] Today shows relevant tasks
- [ ] Project detail page loads directly
- [ ] Mark done works
- [ ] Reopen task works
- [ ] Edit task works
- [ ] Delete task works
- [ ] CalendarDateField still opens date picker

Personalisation:
- [ ] ThemeSwitcher works
- [ ] BackgroundSwitcher works
- [ ] PersonalisationPanel appears on Dashboard
- [ ] Dark mode works
- [ ] Light mode works
- [ ] Background presets work
- [ ] Preferences persist after refresh

Language:
- [ ] English works
- [ ] Simplified Chinese works
- [ ] No Chinese mojibake

Responsive:
- [ ] Mobile AppNav works
- [ ] Mobile Dashboard works
- [ ] Mobile New Project page works
- [ ] No obvious horizontal overflow

## 11. Suggested Git Commands

```bash
git status
git add .
git commit -m "Release v1.4 personalisation version"
git push origin main
```

Suggested tag commands, not run:

```bash
git tag -a v1.4.0 -m "v1.4 Personalisation Version"
git push origin v1.4.0
```
