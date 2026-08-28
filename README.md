# SkillGraph — Frontend

> Vue 3 + TypeScript single-page application for the SkillGraph developer career graph platform.

**Live App:** [https://skillgraph-frontend-delta.vercel.app](https://skillgraph-frontend-delta.vercel.app)  
**Backend API:** [https://skillgraph-backend-kibk.onrender.com/api](https://skillgraph-backend-kibk.onrender.com/api)  
**Demo Recording:** [Watch on Loom](https://www.loom.com/share/336dbb3bce1e4139b95a0901cf0b201c)

---

## Table of Contents

- [Overview](#overview)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Installation](#installation)
- [Running the App](#running-the-app)
- [Building for Production](#building-for-production)
- [Component Architecture](#component-architecture)
- [Connecting to the Backend](#connecting-to-the-backend)

---

## Overview

The SkillGraph frontend is a Vue 3 single-page application that lets developers explore career trajectories through a graph-powered interface. It communicates exclusively with the SkillGraph backend API — it never connects directly to CognoDB.

**Architecture:**
```
Vue 3 SPA
  └── Axios (HTTP)
        └── Express Backend
              └── neo4j-driver (Bolt)
                    └── CognoDB Graph Database
```

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Vue 3 | UI framework (Composition API + `<script setup>`) |
| TypeScript | Type safety |
| Vite 8 | Build tool and dev server |
| Tailwind CSS 4 | Utility-first styling |
| Vue Router 5 | Client-side routing |
| Pinia 4 | State management |
| Axios | HTTP client for API requests |
| lucide-vue-next | Icon library |

---

## Project Structure

```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── select/
│   │   │   │   └── UiSelect.vue        # Reusable select dropdown
│   │   │   ├── loading/
│   │   │   │   └── UiLoading.vue       # Global loading state
│   │   │   └── empty/
│   │   │       └── UiEmptyState.vue    # Global empty state
│   │   └── RoleAnalysis.vue            # Graph traversal results
│   ├── composables/
│   ├── layouts/
│   │   └── MainLayout.vue             # App shell — navbar + footer
│   ├── router/
│   │   └── index.ts                   # Vue Router configuration
│   ├── services/
│   │   └── api.ts                     # Axios instance
│   ├── stores/
│   │   └── graphStore.ts              # Pinia store — state + API calls
│   ├── types/
│   ├── views/
│   │   └── HomeView.vue               # Main dashboard
│   ├── App.vue
│   ├── main.ts
│   └── style.css
├── public/
├── .env.example
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

---

## Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Default | Description |
|---|---|---|
| `VITE_API_BASE_URL` | `http://localhost:3000/api` | Backend API base URL |

> Never add CognoDB credentials to the frontend `.env`. All database communication goes through the backend.

---

## Installation

```bash
cd frontend
npm install
```

---

## Running the App

**Development** (hot-reload via Vite):
```bash
npm run dev
```

Opens at `http://localhost:5173`. Make sure the backend is running at `http://localhost:3000` or update `VITE_API_BASE_URL` in `.env`.

---

## Building for Production

```bash
npm run build
```

Runs `vue-tsc -b` for type checking, then Vite bundles everything into `dist/`. Deploy the `dist/` folder to any static host (Vercel, Netlify, Render, etc.).

Preview the production build locally:
```bash
npm run preview
```

---

## Component Architecture

### UI Components (`src/components/ui/`)

#### `UiSelect.vue`
A fully typed, reusable dropdown select.

| Prop | Type | Default | Description |
|---|---|---|---|
| `modelValue` | `string \| number \| null` | — | Selected value (v-model) |
| `options` | `{ label, value, disabled? }[]` | — | List of options |
| `label` | `string` | — | Label above the select |
| `placeholder` | `string` | `'Select an option'` | Placeholder text |
| `disabled` | `boolean` | `false` | Disables the control |
| `error` | `string` | — | Error message below |
| `variant` | `'default' \| 'filled' \| 'outlined'` | `'default'` | Visual style |

#### `UiLoading.vue`
Animated loading indicator.

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | `string` | `'Loading...'` | Loading message |
| `fullScreen` | `boolean` | `false` | Fills the viewport height |

#### `UiEmptyState.vue`
Empty state container with icon, title, description and an optional action slot.

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | `string` | `'No Data Available'` | Main heading |
| `description` | `string` | `'There is no data to display here yet.'` | Supporting text |

Slots: `#icon`, `#action`

---

### State Management (`src/stores/graphStore.ts`)

The Pinia store manages all API calls and application state:

| State | Type | Description |
|---|---|---|
| `users` | `User[]` | All users fetched from the API |
| `roles` | `Role[]` | All career roles |
| `selectedUser` | `User \| null` | Active user persona |
| `selectedRole` | `Role \| null` | Target career role |
| `userSkills` | `Skill[]` | Skills of the selected user |
| `roleAnalysis` | `RoleAnalysis[]` | Multi-hop gap analysis results |
| `loading` | `boolean` | Global loading flag |
| `error` | `string \| null` | Last error message |

Key behaviour: selecting a new user automatically resets `selectedRole` and `roleAnalysis` to keep the UI consistent.

---

## Connecting to the Backend

All HTTP requests go through [`src/services/api.ts`](src/services/api.ts), a pre-configured Axios instance:

```ts
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api',
  headers: { 'Content-Type': 'application/json' },
});
```

No component calls Axios directly — all requests go through the Pinia store.
