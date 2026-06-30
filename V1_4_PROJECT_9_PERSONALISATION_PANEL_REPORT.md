# v1.4 Project 9 Personalisation Panel Report

## 1. Task name

v1.4 Personalisation Version - Project 9: Personalisation Panel

## 2. Build result

`npm run build` passes.

Build verified with Next.js 16.2.7 / Turbopack.

## 3. Files changed

- `components/PersonalisationPanel.tsx`
- `app/dashboard/page.tsx`
- `V1_4_PROJECT_9_PERSONALISATION_PANEL_REPORT.md`

## 4. Component added

Added `components/PersonalisationPanel.tsx`.

The component is a client component and:

- listens for existing Coursework Compass language changes
- reuses `ThemeSwitcher`
- reuses `BackgroundSwitcher`
- explains local browser preference storage
- includes a motion information section
- uses existing v1.4 surface, border, typography, spacing, and motion classes

## 5. Where the panel was placed

The panel was placed on `/dashboard` after `AppNav` and the dashboard overview/header, before the dashboard loading, empty, stats, and project overview content.

## 6. Whether BackgroundSwitcher was moved/wrapped/reused

`BackgroundSwitcher` was reused inside `PersonalisationPanel`.

The previous standalone dashboard background section was replaced so the dashboard does not show duplicate or awkwardly separated background controls.

## 7. Any ThemeSwitcher or BackgroundSwitcher prop changes

No `ThemeSwitcher` or `BackgroundSwitcher` prop changes were made.

`ThemeSwitcher` is reused with its existing `compact` prop inside the panel.

## 8. English/Chinese copy added

English copy added:

- Workspace preferences
- Personalise your study space
- Choose how Coursework Compass looks in this browser. Theme and background preferences are saved locally.
- Theme
- Switch between the focused dark workspace and the clean daylight workspace.
- Background
- Choose a subtle background atmosphere for your planner.
- Motion
- Subtle motion is used for feedback and polish. Your system reduced-motion preference is respected.
- Reduced motion follows your system setting.
- Saved in this browser
- These preferences are stored locally on this device and do not affect other browsers.

Chinese copy added:

- 工作区偏好
- 个性化你的学习空间
- 选择 Coursework Compass 在当前浏览器中的显示方式。主题和背景偏好会保存在本地。
- 主题
- 在专注的深色工作区和干净的白昼工作区之间切换。
- 背景
- 为你的 planner 选择一个克制的背景氛围。
- 动态效果
- 界面会使用轻量动效提供反馈和质感，并尊重系统的减少动态效果设置。
- 减少动态效果会跟随你的系统设置。
- 保存在当前浏览器
- 这些偏好只会保存在当前设备的浏览器中，不会同步到其他浏览器。

## 9. Dark/light theme notes

The panel uses existing theme-aware classes and CSS variables:

- `cc-section`
- `cc-surface-muted`
- `cc-surface-inset`
- `cc-text-main`
- `cc-text-muted`
- `cc-text-subtle`
- `cc-badge-accent`

No new theme storage behavior was added.

## 10. Mobile notes

The panel stacks on smaller screens and switches to a wider two-area layout on desktop.

Controls use the existing switcher tap targets and responsive grid behavior. No fixed-width layout was added.

## 11. What was intentionally preserved

- Existing `ThemeSwitcher` behavior
- Existing `BackgroundSwitcher` behavior
- Existing theme localStorage behavior
- Existing background localStorage behavior
- Existing language switching
- Existing dark/light themes
- Existing background presets
- Existing motion system
- Existing dashboard loading, empty, stats, and project workflows
- Existing localStorage project/task data shape
- Existing project generation logic
- Existing task editing and completion logic
- `ThemeSwitcher` in `AppNav`
- `BackgroundBootstrap` and `ThemeBootstrap`

## 12. What was intentionally not implemented

- No full Settings page
- No account settings
- No cloud sync
- No analytics
- No AI features
- No custom color picker
- No custom font picker
- No uploaded backgrounds
- No notification settings
- No motion toggle
- No Updates page change
- No README change

## 13. Known risks or manual visual QA notes

- Build validation passed.
- Browser visual QA was not run in this pass.
- Manual visual checks should confirm the panel feels balanced with real saved project data and across all background presets.
- The motion section is informational only and relies on the existing reduced-motion CSS behavior.

## 14. Manual test checklist

Build:

- [x] `npm run build` passes

Dashboard:

- [ ] `/dashboard` loads
- [ ] PersonalisationPanel appears
- [ ] Panel is visually integrated
- [ ] No duplicate awkward background controls
- [ ] Dashboard still shows project data correctly

Theme:

- [ ] ThemeSwitcher works inside or alongside the panel
- [ ] Dark mode works
- [ ] Light mode works
- [ ] Refresh keeps selected theme

Background:

- [ ] BackgroundSwitcher works inside the panel
- [ ] Each background preset can be selected
- [ ] Refresh keeps selected background
- [ ] `document.documentElement.dataset.background` updates correctly

Language:

- [ ] English copy displays correctly
- [ ] Chinese copy displays correctly
- [ ] LanguageSwitcher still works
- [ ] No Chinese mojibake

Motion:

- [ ] Motion information section is visible
- [ ] Reduced-motion claim is accurate based on existing CSS behavior
- [ ] No new heavy animation added

Mobile:

- [ ] Panel stacks cleanly
- [ ] No horizontal overflow
- [ ] Buttons are tappable
- [ ] Text remains readable

Core workflows:

- [ ] New Project still generates a plan
- [ ] Save project still works
- [ ] Project detail still opens
- [ ] Mark done still works
- [ ] Task edit/delete still works
- [ ] Existing localStorage project data still appears
