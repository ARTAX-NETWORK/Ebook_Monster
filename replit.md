# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Main application: **God Tier Ebook Generator** — a full-stack web app that generates professional, uniquely-designed HTML ebooks with multi-language translation support.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **Frontend**: React 18 + Vite + Wouter routing
- **UI**: Tailwind CSS + Shadcn/ui components + Framer Motion
- **Backend**: Express 5
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Application Features

### God Tier Ebook Generator
- **Main form** (`/`) — Configure ebook with title, subtitle, author, GitHub link, brand name, pricing, language selection (10 languages), and QWEN API keys
- **Generate page** (`/generate`) — Shows bundle results, language list, confetti animation on success, ZIP download
- **Ebook generation** — Creates HTML ebook with unique random design (12 color palettes × 4 typography combos × 4 layout architectures)
- **Translation** — Translates to up to 10 languages via QWEN API with rotation system; falls back to LibreTranslate
- **ZIP bundle** — Packages all language versions into a downloadable ZIP
- **QR codes** — Auto-generated QR codes for GitHub repo links via api.qrserver.com

## Structure

```text
artifacts-monorepo/
├── artifacts/
│   ├── ebook-generator/        # React + Vite frontend (serves at /)
│   │   └── src/
│   │       ├── pages/home.tsx       # Main form page
│   │       ├── pages/generate.tsx   # Results & download page
│   │       └── components/layout.tsx
│   └── api-server/             # Express API server (serves at /api)
│       └── src/
│           ├── routes/ebook.ts      # /api/ebook/* endpoints
│           └── lib/
│               ├── ebook-content.ts  # HTML generator (8 chapters + design system)
│               └── ebook-translator.ts # QWEN + LibreTranslate translation
├── lib/                    # Shared libraries
│   ├── api-spec/           # OpenAPI spec + Orval codegen config
│   ├── api-client-react/   # Generated React Query hooks
│   ├── api-zod/            # Generated Zod schemas from OpenAPI
│   └── db/                 # Drizzle ORM schema + DB connection
├── pnpm-workspace.yaml
├── tsconfig.base.json
├── tsconfig.json
└── package.json
```

## API Endpoints

- `GET /api/healthz` — Health check
- `POST /api/ebook/generate` — Generate ebook bundle (returns bundleId)
- `GET /api/ebook/preview/:bundleId` — Get bundle info (languages, brand, theme)
- `GET /api/ebook/download/:bundleId` — Download ZIP bundle (expires in 1 hour)

## TypeScript & Composite Projects

Every package extends `tsconfig.base.json` which sets `composite: true`. The root `tsconfig.json` lists all packages as project references.

## Root Scripts

- `pnpm run build` — runs `typecheck` first, then recursively runs `build` in all packages
- `pnpm run typecheck` — runs `tsc --build --emitDeclarationOnly` using project references
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API client from OpenAPI spec

## Ebook Design System

### Color Palettes (12 options, randomly selected)
Or et Nuit, Forêt et Or, Cyan Profond, Magma, Jade, Améthyste, Rubis, Saphir, Émeraude, Topaze, Perle, Obsidienne

### Typography Combinations (4 options)
Playfair Display/Inter, Montserrat/Open Sans, Poppins/Roboto, DM Serif Display/DM Sans

### Layout Architectures (4 options)
Tabs, Sidebar, Grid, Terminal

### Brand Name Generator
Auto-generates from [Adjective][Noun][Suffix] pattern (e.g., "Infinite Blueprint Next")

## Notes

- No database required (bundles stored in memory for 1 hour)
- No authentication required
- No payment required
- 100% runs on free tier
- Bundles expire after 1 hour
