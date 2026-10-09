# Idealy Studio

A fresh UI implementation for Idealy, kept separate from the original application repository.

## Stack

- Next.js App Router + React 19 + TypeScript
- Tailwind CSS 4 foundation, with a token-driven custom design system
- Motion for interface movement and transitions
- Lucide for UI icons; Simple Icons for brand marks
- Sonner for toast feedback
- shadcn/ui conventions configured for Base UI, plus a shared `cn` utility for accessible, reusable components
- XYFlow powers the interactive, draggable and connectable workflow canvas

## Run locally

```bash
pnpm install
pnpm dev
```

## Scope of this first pass

This first version establishes the workspace UI and the interaction patterns for navigation, a keyboard-accessible command palette, a draggable workflow canvas, illustrated agent portraits, a nine-item connector catalogue copied from the original app, activity, notifications, themes, four existing plan tiers with configured prices, and a fast-chat path that avoids launching agents for greetings and ordinary questions. AI generation, OAuth, project persistence, notifications from the backend, and billing are not represented as live services; those interactions are explicitly marked as local prototype behavior.

The welcome, registration, and initial profile-information flows remain outside this repo's scope so they can later be retained from the original project as requested.

## Deploy on Netlify

This repository is configured for Netlify with `netlify.toml` and Node.js 22. Netlify should detect the Next.js App Router application and apply its Next.js runtime automatically; do not set the publish directory to `.next` manually.

1. In Netlify, choose **Add new site → Import an existing project** and connect this GitHub repository.
2. Keep the repository root as the base directory.
3. Use `pnpm build` as the build command. Leave the publish directory unset so Netlify's Next.js runtime can configure it.
4. Deploy. For future updates, push commits to the connected branch and Netlify will rebuild automatically.

Before treating this as production-ready, run `pnpm install`, `pnpm typecheck`, `pnpm lint`, and `pnpm build` locally or in CI. This repository currently describes AI generation, OAuth, project persistence, backend notifications, and billing as prototype-only rather than live services; deployment does not activate those services.
