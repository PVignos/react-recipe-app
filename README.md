# Recipe Recommender

A small React app that suggests recipes based on a area and an ingredient you choose.

## Setup

```bash
pnpm install
pnpm dev
```

Requires Node 18+. No API key needed — data comes from [TheMealDB](https://www.themealdb.com/api.php).

## How it works

Pick a cuisine in step 1, then search for an ingredient in step 2. The app finds recipes that match both, picks one, and lets you rate it. Ratings are saved in localStorage and visible in the History page.

A few things worth noting:

- The ingredient field is a live autocomplete — it filters as you type, pulled from `/list.php?i=list` (one request, cached forever).
- "New Idea" cycles through all matching recipes for the same criteria before repeating.
- Each recipe has its own URL, so you can share or bookmark it directly.
- History supports Liked / Disliked / All filtering.

## Stack

React, TypeScript, Vite, Zustand, TanStack Query, Tailwind.

## Testing

```bash
pnpm test        # watch mode
pnpm test --run  # single run
```

Tests are written with Vitest + React Testing Library.

Focus is on behavior, not implementation:

- user interactions and visible UI changes
- API results reflected in the interface
- core store and service logic

Rules:

- prefer `getByRole` and `userEvent`
- mock only external boundaries (APIs, network)
- avoid testing styles, DOM structure, or internal implementation
- keep each test focused on a single behavior

## Deploy

```bash
pnpm build    # outputs to dist/
pnpm preview  # preview the production build locally
```

The app is a static SPA — no server required. Upload the contents of `dist/` to any static host and configure it to redirect all routes to `index.html`.
