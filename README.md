# Coursework Compass

**Coursework Compass v1.2.0 - Student Testing Polish**

Coursework Compass is a coursework planning web app for IB, A-Level, and international school students. It helps students turn large academic projects into clear tasks, deadlines, progress, and daily actions.

Live site: https://coursework-compass.vercel.app

---

## Current Version

**v1.2.0 Student Testing Polish**

This release focuses on making Coursework Compass clearer, safer, more stable, and easier to test with real students.

v1.2.0 is now considered a student testing release. Future development should be guided by real Year 12 and Year 13 feedback rather than rapid feature expansion.

---

## What Coursework Compass Does

Coursework Compass helps students:

* Create coursework projects from subject templates
* Set project deadlines
* Generate structured task plans
* Track progress through Dashboard, Projects, Today, and Project Details
* Add custom tasks
* Edit task title, priority, due date, and estimated time
* Mark tasks as done and restore them back to todo
* Delete tasks and projects
* Archive completed tasks
* See days left and overdue status
* Use a guided student testing tutorial
* Send structured feedback

---

## v1.2.0 Highlights

### Student Testing Polish

* Unified product labels as **v1.2 Student Testing Polish**
* Added a first-visit onboarding popup
* Added clearer browser-only local storage notices
* Improved Dashboard, Projects, and Today empty states
* Added clearer save success feedback
* Improved mobile navigation and mobile layout foundations
* Added unified inline error messages
* Fixed estimated time display and conversion
* Restored days-left indicators
* Stabilised Project Detail hydration behaviour
* Improved project deletion
* Improved local storage quota handling
* Prepared the product for Year 12 and Year 13 student testing

---

## Important Data Notice

Coursework Compass v1.2.0 currently stores project data **locally in the browser**.

This means:

* No account is required
* No cloud sync is currently available
* Data is saved only in the current browser
* Data may not appear on another device or browser
* Data may be removed if the user clears browser data
* Students should avoid entering sensitive personal information during testing

Cloud accounts and cross-device sync are planned for a later version.

---

## Student Testing Flow

The project includes a dedicated guided testing route:

`/test`

The test route is separated from the real planner. It uses simulated data and helps students understand the workflow before creating real saved projects.

Suggested testing flow:

1. Open the homepage
2. Read the onboarding popup
3. Open the guided tutorial
4. Complete the tutorial steps
5. Create a real sample project
6. Test Dashboard, Projects, Today, and Project Details
7. Add, edit, complete, restore, and delete tasks
8. Test estimated time conversion
9. Check the mobile experience
10. Send structured feedback

---

## Core Pages

* `/`
  Main landing page

* `/test`
  Guided student testing tutorial

* `/dashboard`
  Overall project progress and active overview

* `/projects`
  Saved coursework project library

* `/projects/new`
  Create a new coursework plan

* `/projects/[projectId]`
  Project detail workspace

* `/today`
  Daily active task list

* `/updates`
  Release notes and testing guidance

---

## Key Features

### Project Planning

Students can create a coursework project using a template, deadline, and planning settings.

### Editable Task Workspace

Students can add, edit, delete, complete, and restore tasks.

### Estimated Time Conversion

The app normalises estimated time values.

Examples:

* `60 min` becomes `1 hour`
* `120 min` becomes `2 hours`
* `24 hours` becomes `1 day`

### Deadline Visibility

Tasks and projects show deadline information, including days left and overdue status.

### Local Storage

Project data is saved in browser local storage during the beta stage.

### Mobile UI Foundation

v1.2.0 improves mobile navigation, onboarding, empty states, toast messages, and the clock widget.

### Guided Tutorial

The `/test` page provides an isolated tutorial experience for student testers.

---

## Tech Stack

* Next.js
* React
* TypeScript
* Tailwind CSS
* Vercel
* Browser localStorage

---

## Development Commands

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Build production version:

```
npm run build
```

Start production server:

```
npm run start
```

---

## Version History

### v1.2.0 - Student Testing Polish

Completed the student testing release. This version focuses on onboarding, mobile layout foundations, local storage clarity, save success feedback, empty states, estimated time repairs, deadline visibility, inline error feedback, and overall testing stability.

### v1.1.3 - Guided Test Flow + Homepage Restore

Restored the homepage to a normal product entry, added a larger Join student test button, redesigned `/test` as an isolated tutorial sandbox, added a feedback loading screen, and added a final congratulations screen after testing.

### v1.1.2 - Student Testing Guide

Added a dedicated student testing page, suggested sample projects, clearer feedback instructions, and testing labels in feedback email subjects.

### v1.1.1 - Pre-Test Polish

Added clearer tester guidance, short feedback prompts, mobile testing guidance, and a focused testing checklist.

### v1.1 - Editable Planner

Added support for adding, editing, deleting, completing, restoring, and archiving tasks.

### v1.0 - Public MVP

Initial public version with project creation, generated coursework plans, local saving, progress tracking, Dashboard, Today, Projects, and Project Details.

---

## Current Limitations

* Project data is stored locally in the browser
* There is no account system yet
* Cloud sync is not available yet
* Feedback is currently collected through email templates
* AI-generated adaptive planning is not included yet
* The guided tutorial uses simulated data

---

## Roadmap

### v1.3 - Feedback and Insight Release

Planned focus:

* Analyse real student feedback
* Improve the feedback system
* Adjust unclear user flows
* Add or refine subject templates based on demand
* Improve mobile experience based on real testing

### Future Versions

Possible future improvements:

* Chinese language support
* Theme switching
* More subject-specific templates
* Cloud accounts
* Cross-device sync
* Export options
* Smarter planning assistance

---

## Release Status

**v1.2.0 is frozen for student testing.**

Before the student testing session, the project should avoid major feature changes. Only critical bugs or small text/UI fixes should be made.

Future development should be based on real user feedback.

---

## Author

Created by Zichuan as an independent student software project.

Coursework Compass is built to help students make long coursework projects less overwhelming, more visible, and easier to act on.
