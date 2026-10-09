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

This first version establishes the workspace UI and the interaction patterns for navigation, a keyboard-accessible command palette, a draggable workflow canvas, illustrated agent portraits, the real nine-item connector catalogue from Idealy, activity, notifications, themes, and the four existing plan tiers with product-configured prices. AI generation, OAuth, project persistence, notifications from the backend, and billing are not represented as live services; those interactions are explicitly marked as local prototype behavior.

The welcome, registration, and initial profile-information flows remain outside this repo's scope so they can later be retained from the original project as requested.
