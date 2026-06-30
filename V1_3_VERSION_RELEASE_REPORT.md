# v1.3 Version Release Report

## Build Result

- `npm run build` passed.
- Next.js production build completed successfully with TypeScript and static page generation.

## Files Changed

- `app/updates/page.tsx`
- `app/page.tsx`
- `components/FeedbackPanel.tsx`
- `components/OnboardingPopup.tsx`
- `lib/i18n.ts`
- `README.md`
- `V1_3_VERSION_RELEASE_REPORT.md`

## Where v1.3 Labels Were Updated

- Updates page current release hero now uses `v1.3 Multilingual Foundation` and `v1.3 多语言基础版本`.
- Updates page history now includes a newest `v1.3` entry above older releases.
- App navigation version label now shows `v1.3 Multilingual Foundation` / `v1.3 多语言基础版本`.
- Beta notice badge now shows `v1.3 beta` / `v1.3 测试版`.
- Homepage Chinese release badge now uses `v1.3 多语言基础版本`.
- Onboarding Chinese release badge now uses `v1.3 多语言基础版本`.
- Feedback panel Chinese v1.3 wording now uses `多语言基础版本`.
- README current version and feature list describe v1.3 Multilingual Foundation.

## Older Update History Preserved

- Existing historical entries for `v1.2`, `v1.1.3`, `v1.1.2`, `v1.1.1`, `v1.1`, `v1.0.x`, and `v1.0` were kept.
- Older release notes were not renamed to v1.3.

## Manual Test Checklist

- [ ] `/updates` shows v1.3 as the newest entry.
- [ ] AppNav or visible site chrome shows v1.3 where appropriate.
- [ ] Beta notice or onboarding does not still claim v1.2 as current.
- [ ] Language switch still works.
- [ ] README says current version is v1.3.
- [x] `npm run build` passes.
