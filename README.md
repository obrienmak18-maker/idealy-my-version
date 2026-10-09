# Idealy Studio

A fresh UI implementation for Idealy, kept separate from the original application repository.

## Stack

- Next.js App Router + React 19 + TypeScript
- Tailwind CSS 4 foundation, with a token-driven custom design system
- Motion for interface movement and transitions
- Lucide for UI icons; Simple Icons for brand marks
- Sonner for toast feedback
- shadcn-compatible component conventions, with Radix and Base UI available for accessible primitives
- XYFlow available for the next iteration of the real, interactive workflow canvas

## Run locally

```bash
pnpm install
pnpm dev
```

## Scope of this first pass

This commit establishes the workspace UI and the interaction patterns for navigation, command palette, canvas, agent activity, connectors, notifications, appearance, and plan overview. AI generation, OAuth, persistence, billing, and connector APIs are deliberately not faked as live services; the visible interactions are a local front-end prototype.

The welcome, registration, and initial profile-information flows remain outside this repo's scope so they can later be retained from the original project as requested.
