# Future Roadmap

The MVP focuses purely on single-device, offline tracking. The following are planned future improvements:

## 1. Backend Synchronization
- **Goal:** Prevent data loss if the device is cleared or lost.
- **Approach:** Integrate a lightweight BaaS like Supabase or Firebase.
- **Requirement:** Must maintain offline-first capability. The app should continue writing to IndexedDB and sync in the background when online.

## 2. Multi-User Support ("Husband Mode")
- **Goal:** Allow partners or caregivers to see the feeding/pumping timeline and active timers.
- **Approach:** Read-only (or collaborative) sharing via simple invite links.

## 3. Cross-Device Sync
- **Goal:** Mother logs pumping on a tablet; partner checks the timer on their phone.
- **Approach:** Real-time listeners (e.g., Supabase Realtime) updating the Zustand store.

## 4. Analytics & Daily Stats
- **Goal:** Provide simple insights without overwhelming the user.
- **Approach:** Add a "Stats" tab showing total pumping volume (if volume tracking is added), or just counts of feedings/pumps over the last 24 hours.

## 5. PWA Enhancements
- **Goal:** Deeper OS integration.
- **Approach:** Implement advanced background sync and Service Worker Push APIs for more reliable off-screen notifications.
