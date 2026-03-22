# System Architecture

## Overview
Lacta Care is built as an offline-first Progressive Web App (PWA) using Vite, React, and TypeScript. The architecture is designed for immediate interactivity and resilience against poor network conditions.

## Tech Stack
- **Frontend:** React (Vite) for fast rendering and minimal bundle size.
- **Styling:** Tailwind CSS v4, utilizing a custom pastel theme.
- **State Management:** Zustand, providing lightweight and unopinionated local state.
- **PWA Capabilities:** vite-plugin-pwa (Workbox) to manage service worker generation, static asset caching, and offline support.

## Data Flow & Storage Approach
- **Local-First:** The app currently operates entirely client-side. There is no remote backend for the MVP.
- **Storage:** Data is persisted using Zustand's `persist` middleware, which abstracts over `localStorage` (or `IndexedDB` if configured). This ensures instant data retrieval upon app load.
- **Future Sync-Ready:** The data model uses UUIDs (`id`) and timestamps (`created_at`) to enable conflict-free synchronization if a remote backend (e.g., Supabase, Firebase) is introduced later.

## Notification Handling
- **Browser Notifications:** The app requests native Notification API permissions.
- **Local Fallback:** In the absence of native notification support (common in iOS web apps without installation), the app relies on strong visual UI alerts (Red/Expired states in Active Timers).
- **Service Worker:** Future iterations will utilize the Workbox service worker to schedule background local notifications.
