# Portfolio Build Notes (from scratch to “enterprise-level”)

Generated: 2026-02-11

These notes document everything I did end-to-end while building my portfolio as a real engineering project: setup, debugging, refactoring, Git workflow, deployment, CI, and automation tooling.

The goal was not only to build a cool-looking portfolio, but to build it like a real software project that would impress employers and prove real skills.

# Table of Contents

1. Project goal and mindset
2. Tech stack used (and why)
3. First environment checks
4. Lint + build baseline checks
5. Fixing ESLint errors and React purity issues
6. Refactoring into a real folder structure
7. Performance improvement (bundle size + code splitting)
8. Deployment to Vercel
9. Debugging blank screen on production deployment
10. ErrorBoundary for stability
11. Git and GitHub setup (first time workflow)
12. What `.gitignore` is and why it matters
13. First commit + push to GitHub
14. Fixing “push rejected (fetch first)” error
15. GitHub Actions CI setup
16. CI badge in README
17. Prettier formatting setup
18. Husky + lint-staged pre-commit automation
19. Updating lint-staged to run Prettier + ESLint
20. Adding Prettier check into GitHub Actions CI
21. Debugging YAML indentation errors
22. Debugging `package.json` JSON parsing errors
23. What this repo now proves to employers
24. Daily workflow checklist
25. Future roadmap upgrades

---

# 1) Project goal and mindset

The purpose of this project is to build a portfolio that looks impressive and also proves I understand real software development workflow.

Instead of making a simple portfolio website, I wanted to build something that shows I can handle:

- modern frontend development (React + Vite)
- advanced UI (3D with Three.js)
- clean structure and refactoring
- debugging and problem solving
- Git/GitHub workflow
- deployment pipeline (Vercel)
- CI automation (GitHub Actions)
- formatting and linting enforcement (Prettier, ESLint, Husky)

This is important because employers don’t only look for “a nice website”. They want to see that I can work in a real development environment and follow real development standards.

---

# 2) Tech stack used (and why)

## Languages

- **JavaScript (ES Modules)**  
  JavaScript is the main language for modern web development and required for React projects.

## Framework / tooling

- **React 19**  
  Used for building the UI as reusable components.

- **Vite 7**  
  Used as a development server and build tool (fast builds, fast HMR).

- **Node.js + npm**  
  Used for running scripts, installing dependencies, and managing packages.

- **ESLint**  
  Used to catch bugs early and enforce best practices.

## 3D / visuals

- **three**  
  The 3D engine that powers the graphics.

- **@react-three/fiber**  
  React renderer for Three.js. Builds 3D scenes using React components.

- **@react-three/drei**  
  Helpers/components for R3F (saves time, reduces boilerplate).

- **@react-three/postprocessing**  
  Adds effects like glitch and chromatic aberration.

- **typed.js**  
  Typing animation.

- **lucide-react**  
  Clean icon library (terminal icon, etc.).

## Why this stack is “modern”

- React + Vite is widely used in real projects.
- Three.js/R3F shows advanced UI capability.
- Deployment + CI + formatting automation are “real engineering workflow” signals.

---

# 3) First environment checks

Before building anything serious, I checked my environment:

bash
node -v
npm -v
npm ls react react-dom vite

Why I did this

Many frontend issues come from:
• wrong Node version
• dependency conflicts
• mismatched React versions
• Vite incompatibility with Node versions

Checking early prevents hours of debugging later.

⸻

# 4) Lint + build baseline checks

Running ESLint

npm run lint

What linting means (simple explanation)

Linting is like a spell-checker for code. It finds mistakes that may not break immediately but can cause bugs later.

Examples:
• unused variables
• missing imports
• incorrect React hook usage
• suspicious patterns

Running production build

npm run build

Why build matters

A project can work in development mode but fail in production.

Running a build early confirms:
• bundler output is valid
• dependencies resolve correctly
• code compiles for production
• deployment won’t instantly fail

⸻

# 5) Fixing ESLint errors and React purity issues

What happened

When I ran ESLint, I hit issues like:
• unused variables (example: imported hooks not used)
• warnings that some code patterns were risky
• issues caused by “impure” logic in render paths

Why this matters

React expects rendering to be stable and predictable. If random values or side-effect logic happens during render, React can behave unpredictably.

This can cause:
• unstable UI
• bugs that appear only in production
• performance problems

Fix implemented (important one)

I made sure random point generation runs only once (not every render), by using a lazy initializer pattern such as:

const [{ cloud, sphere }] = useState(() => {
// generate Float32Array once
});

Why this works

The initializer runs once on mount, not on every re-render.

Result: lint became clean and the app became more stable.

⸻

# 6) Refactoring into a real folder structure

Problem

At the beginning, App.jsx was too big. It contained:
• 3D scene logic
• UI overlay logic
• typed animation logic
• layout + state
• styles mixed together

That works for quick demos, but not for maintainable software.

Fix: split responsibilities

I refactored into a more realistic architecture:

Scene-related code
• src/components/scene/ParticleField.jsx
• src/components/scene/HeroScene.jsx

UI components
• src/components/ui/TerminalOverlay.jsx

Stability component
• src/components/ui/ErrorBoundary.jsx

Why this matters

This is how real teams structure React projects:
• App is the “orchestrator” (state + layout + wiring)
• scene/ contains 3D rendering code
• ui/ contains non-3D UI pieces

It’s easier to debug, easier to expand, and looks professional.

⸻

# 7) Performance improvement (bundle size + code splitting)

Problem

When I ran npm run build, I got chunk size warnings (large bundle), mainly because Three.js/R3F is heavy.

That can lead to:
• slow loading
• poor mobile experience
• worse Lighthouse score

Fix: code splitting with React.lazy + Suspense

I lazy-loaded the heavy 3D scene:

import React, { Suspense, lazy } from "react";

const HeroScene = lazy(() => import("./components/scene/HeroScene.jsx"));

Then used:

<Suspense fallback={null}>
  <HeroScene isHuman={isHuman} glitch={glitch} />
</Suspense>

Why this matters

This keeps the main bundle smaller and loads heavy 3D code separately.

Code splitting is a real production technique and an “enterprise-level” signal.

⸻

# 8) Deployment to Vercel

What I did

I deployed the GitHub repo to Vercel:
• logged in to Vercel
• connected GitHub
• imported the repo
• Vercel auto-detected it as a Vite project
• clicked Deploy

Result

My live site URL:

https://my-portfolio-eight-mocha-47.vercel.app/

Why this matters

This proves I can ship a working web app publicly, not just run it locally.

⸻

# 9) Debugging blank screen on production deployment

Problem

After deployment, the app loaded then showed a blank screen.

Errors included:
• Minified React error #306
• TypeError: Cannot convert object to primitive value
• React lazy initialization failures

Root cause

Production bundles are stricter and can reveal issues hidden in dev.

The main cause was a mismatch with lazy-loaded component exports and/or module resolution:
• React.lazy() expects the imported module to provide a default export React component.

If it doesn’t, the app can crash in production.

Fixes

I made sure:
• HeroScene.jsx uses export default
• the lazy import path is correct
• the lazy import is kept stable (best practice: define it outside App if possible)
• refactor mistakes (duplicate components / stray code blocks) were removed

After this, the deployed version worked again.

⸻

# 10) ErrorBoundary for stability

What is an ErrorBoundary

An ErrorBoundary catches runtime crashes in React components and shows a fallback UI instead of a full blank screen.

Why I added it

In production, one crash can destroy the entire user experience.

Error boundaries are common in real apps to:
• avoid blank screens
• give a readable fallback message
• speed up debugging

⸻

# 11) Git and GitHub setup (first time workflow)

Git vs GitHub (simple)
• Git = version history on my laptop
• GitHub = remote copy online (plus collaboration + Actions + integrations like Vercel)

⸻

# 12) What .gitignore is and why it matters

.gitignore tells Git what NOT to track.

It prevents committing:
• node_modules/ (huge, regenerates from npm install)
• dist/ (generated build output)
• logs, editor folders, OS junk (like .DS_Store)

Why it matters
• keeps the repo clean
• avoids huge commits
• avoids leaking machine-specific files

⸻

# 13) First commit + push to GitHub

I checked status:

git status

Staged files:

git add .

Committed:

git commit -m "chore: initial portfolio setup"

Added remote:

git remote add origin https://github.com/hardcodedtechie/my-portfolio.git

Pushed:

git push -u origin main

Why this matters
• this is the standard “first time” workflow
• it created my repo history and enabled deployment/CI

⸻

# 14) Fixing “push rejected (fetch first)” error

What happened

Git rejected my push because the remote had commits that my local didn’t.

This usually happens when I edited files directly in GitHub UI or another machine pushed first.

Fix

I pulled remote changes first (clean history approach):

git pull --rebase origin main
git push

Why rebase
• keeps history clean
• avoids extra merge commits

⸻

# 15) GitHub Actions CI setup

What is CI

CI = Continuous Integration.

It automatically runs checks (like lint/build) on every push/PR.

Why I set it up

CI proves professional workflow:
• catches errors before deployment
• enforces project quality
• shows green checks in GitHub

What I added

A workflow file:
• .github/workflows/ci.yml

It runs:
• install deps (npm ci)
• lint (npm run lint)
• build (npm run build)

⸻

# 16) CI badge in README

I added a badge to show CI status:

![CI](https://github.com/hardcodedtechie/my-portfolio/actions/workflows/ci.yml/badge.svg)

Why
• makes the repo look professional
• instantly shows build health

⸻

# 17) Prettier formatting setup

What is Prettier

Prettier formats code automatically (consistent style).

Why it matters
• fewer style arguments
• cleaner diffs
• faster reviews
• consistent codebase

Scripts added

In package.json:

"format": "prettier --write .",
"format:check": "prettier --check ."

⸻

# 18) Husky + lint-staged pre-commit automation

What is Husky

Runs commands automatically when I commit (like a “checkpoint guard”).

What is lint-staged

Runs formatting/lint only on the files I staged (fast).

Why I added it

It prevents committing broken or messy code.

This is very common in real teams.

⸻

# 19) Updating lint-staged to run Prettier + ESLint

I configured lint-staged so commits do:
• Prettier format
• ESLint fix (for JS/JSX)

Example config:

"lint-staged": {
"_.{js,jsx,css,md,json}": ["prettier --write"],
"_.{js,jsx}": ["eslint --fix"]
}

Why
• commits stay clean
• fewer “format-only” commits later

⸻

# 20) Adding Prettier check into GitHub Actions CI

I upgraded CI so it also checks formatting:
• npm run format:check
• npm run lint
• npm run build

Why
• CI becomes the final gate
• even if local automation fails, CI catches it

⸻

# 21) Debugging YAML indentation errors

I broke the workflow YAML at one point because indentation was incorrect.

YAML is strict: indentation defines structure.

Fix:
• aligned steps: and each - name: properly
• removed mis-indented lines (example: a - name: accidentally nested under the previous step)

⸻

# 22) Debugging package.json JSON parsing errors

I hit:
• npm error code EJSONPARSE

Cause
• missing commas
• invalid JSON structure

Fix
• corrected commas and closing braces in the scripts section
• made sure package.json stays valid JSON (not JS)

Lesson
• package.json must be strict JSON
• one missing comma breaks all npm scripts

⸻

# 23) What this repo now proves to employers

Frontend skills
• React + Vite project setup
• component architecture
• hooks usage (useEffect, useState, useRef)
• advanced UI with Three.js / R3F
• animations + postprocessing effects
• performance optimization (code splitting)

Engineering workflow skills
• Git/GitHub workflow
• meaningful commits
• repo hygiene (.gitignore)
• CI pipeline (GitHub Actions)
• deployment pipeline (Vercel)
• Prettier formatting
• ESLint enforcement
• Husky + lint-staged pre-commit checks
• debugging production issues

This portfolio demonstrates both creativity and professional workflow.

⸻

# 24) Daily workflow checklist (recommended)

    1.	Make changes in VS Code
    2.	Run checks:

npm run lint
npm run build

    3.	Stage changes:

git add .

    4.	Commit:

git commit -m "feat: add projects section"

    5.	Push:

git push

    6.	Check GitHub Actions (green)
    7.	Check Vercel deployment (live)

⸻

# 25) Future roadmap upgrades

Portfolio upgrades
• Add Projects section with real case studies
• Add About section
• Add Contact section (LinkedIn + GitHub + email)
• Add project detail pages

Engineering upgrades
• Convert to TypeScript (strong signal)
• Add unit tests (Vitest)
• Add e2e tests (Playwright)
• Improve accessibility (ARIA, keyboard navigation)
• Optimize performance (manualChunks, asset optimization)
• Add SEO/OpenGraph metadata
• Add analytics (Vercel Analytics or Plausible)

```

```
