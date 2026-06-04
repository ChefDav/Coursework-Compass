# Coursework Compass

Coursework Compass is a coursework planning web app for students who need to turn large assignments into clear daily tasks.

It helps students create coursework projects, generate task plans from templates, track progress, mark tasks as done, and archive completed work.

## Live Demo

Live demo: (https://coursework-compass.vercel.app/)

## Current Status

This project is currently a local-first MVP.

Data is saved in the browser with localStorage. User accounts, cloud sync, and database storage are planned for future versions.

## Core Features

- Create coursework projects from templates
- Choose a deadline and planning intensity
- Generate task plans automatically
- Save generated projects locally in the browser
- View saved projects on the dashboard
- View daily tasks on the Today page
- Mark tasks as done
- Automatically calculate project progress from completed tasks
- Show a completion prompt when a project reaches 100%
- Archive completed tasks while keeping the project record
- View individual project detail pages
- Delete local projects
- Reset all local data
- Mobile-friendly layout

## Supported Coursework Templates

- Math IA
- Computer Science IA
- Extended Essay
- TOK Essay
- English Essay
- Economics Commentary

## Main User Flow

1. Open the landing page.
2. Start a new project.
3. Choose a coursework template.
4. Enter a project name, deadline, and planning intensity.
5. Generate a task plan.
6. Save the project locally.
7. Track the project on the dashboard.
8. Complete tasks from the Today page or project detail page.
9. Watch project progress increase.
10. Archive completed tasks after finishing a project.

## Tech Stack

- Next.js
- React
- TypeScript
- Tailwind CSS
- localStorage
- GitHub
- Vercel

## Pages

| Page | Purpose |
| --- | --- |
| `/` | Landing page and product entry point |
| `/dashboard` | Saved project overview and progress tracking |
| `/projects` | Project library, templates, delete/reset actions |
| `/projects/new` | Create and generate a new coursework plan |
| `/projects/[projectId]` | Individual project detail page |
| `/today` | Daily task execution page |

## Local Development

Install dependencies:

```bash
npm install
