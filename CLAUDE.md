# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

鄰學（Lín Xué）— a static frontend that aggregates community-university (社區大學) course listings from multiple schools in Taiwan, so residents can search, compare, and favorite courses without any backend. All course data is scraped weekly into static JSON and read client-side; there is no server, database, or auth.

Full spec docs (read these before making product decisions):
- [社大課程整合平台_執行計劃書.md](社大課程整合平台_執行計劃書.md) — execution plan: tech stack rationale, repo layout, Course schema, data strategy
- [PRD/PRD_INDEX.md](PRD/PRD_INDEX.md) — index of one PRD file per page/route
- [design-system/readme.md](design-system/readme.md) and [design-system/SKILL.md](design-system/SKILL.md) — the 鄰學 visual design system (the `design-system` skill, invocable as `/design-system`, regenerates on-brand UI from this)

## Commands

```bash
npm run dev       # Vite dev server
npm run build     # tsc -b && vite build (typecheck is part of build, not a separate step)
npm run lint      # eslint .
npm run preview   # preview a production build
```

There is no test runner configured yet.

## Architecture

### Frontend stack and why
React + Vite + TypeScript, React Router v7 (client-side SPA routing only — deployed as a static site to GitHub Pages with a 404-redirect trick, no server-side routing), Tailwind v4 + shadcn/ui, TanStack Query for fetching the static JSON, Zustand for the in-memory compare-list state. These choices are fixed by the execution plan (section "技術選型"), not arbitrary — don't introduce a different router, state library, or CSS framework without checking that doc first.

### Two-layer component model
There are two distinct UI layers; know which one to reach for:
- `src/components/core/` and `src/components/navigation/` — brand components ported from the `design-system` skill (`Button`, `Badge`, `Card`, `Tag`, `Input`, `StatCard`, `AppSidebar`). These are **inline-style, CSS-variable-driven** (not Tailwind classes) — every visual value comes from the custom properties in `src/styles/tokens/*.css`. This is intentional: it keeps them pixel-identical to the design system regardless of Tailwind config drift. Extend these by adding variants to their internal `variantMap`/`sizeMap` objects, following the existing pattern — don't bolt on Tailwind classNames.
- `src/components/ui/` — generic shadcn/ui primitives (e.g. `button.tsx`, built on `@base-ui/react`), Tailwind-class-driven. Use these for behavior-heavy primitives (dialogs, dropdowns, popovers) that the design system doesn't define. Their Tailwind theme tokens (`--primary`, `--background`, etc., declared in `src/index.css`) are mapped onto the same brand CSS variables, so colors stay consistent across both layers — if you add a new shadcn component via `npx shadcn add`, check that its colors render correctly rather than reverting to shadcn's default oklch palette.

### Design tokens
`src/styles/tokens/{colors,typography,spacing,effects}.css` are copied verbatim from `design-system/tokens/`. If the design system is regenerated, re-sync these files rather than hand-editing token values. `src/index.css` is the single place that (a) imports the tokens, (b) maps shadcn's semantic variables onto them, (c) sets up the Tailwind `@theme inline` block. Brand facts worth knowing: accent is Morandi blue-green (`--color-accent: #3e8a84`, not the orange typical of dashboard templates this was modeled on), flat design (no shadows), Space Grotesk for numerals + Noto Sans TC for Chinese text, pill-shaped buttons/badges, 120ms transitions only.

### Routing and layout
`src/App.tsx` defines all routes nested under a single `Layout` (`src/components/layout/Layout.tsx`), which renders the dark icon-only `AppSidebar` + `Header` persistently and an `<Outlet>` for page content. Routes map 1:1 to PRD files under `PRD/2.0-前端核心/` and `PRD/3.0-資料呈現/`: `/` (課程列表, 2.1), `/compare` (跨校比較, 2.3), `/favorites` (我的最愛, 2.4), `/schedule` (時間表, 3.1), `/about` (關於, 4.3). The 課程詳細 Modal (PRD 2.2) is an overlay, not a route — implement it as a modal triggered from the course list, not a page.

There is currently no catch-all (`*`) route — an unmatched path renders nothing (not even the Layout), since React Router only mounts a matched leaf.

### Data layer (per execution plan, not yet implemented)
- Course data: static JSON per school under `data/courses/*.json` (scraped weekly via a GitHub Actions cron + `scraper/`), fetched client-side via TanStack Query — no backend.
- Favorites: persisted to `localStorage` (`cca_favorites`), an array of course IDs.
- Compare list: Zustand, in-memory only (max 3 courses, clears on refresh).
- User filter/theme preferences: `localStorage`.
- The `Course` TypeScript shape lives in `src/types/course.ts`, mirrored from the schema in the execution plan (§5.1) — keep these in sync if the schema changes.

### Path alias
`@/*` resolves to `src/*` (configured in both `tsconfig.app.json` and `vite.config.ts`). Use it for all intra-`src` imports.
