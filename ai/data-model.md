# Data Model

## Schema Definition
The core data structure revolves around the `ActivityLog` object, representing a single tracking event.

```typescript
type LogType = 'pumping' | 'asi' | 'formula';

interface ActivityLog {
  id: string;               // Unique identifier (UUID/crypto.randomUUID)
  user_id?: string;         // Reserved for future multi-user support
  type: LogType;            // Type of activity logged
  created_at: number;       // Unix timestamp of when the log was created
  next_reminder_at: number | null; // Unix timestamp for next required action (e.g., next pump in 3h)
  expires_at: number | null;// Unix timestamp for when the item expires (e.g., ASI in 4h)
  synced?: boolean;         // Reserved for future backend sync tracking
}
```

## Field Purposes
- `id`: Essential for uniquely identifying records, deleting specific logs, and future database synchronization.
- `user_id`: Currently unused, but positioned for the "husband mode" sharing feature later.
- `type`: Used to render specific icons, colors, and calculate appropriate timers.
- `created_at`: The baseline time for timeline sorting and timer calculations.
- `next_reminder_at`: Specific to `pumping` events. Drives the 3-hour next-pump UI timers.
- `expires_at`: Specific to `asi` (4-hour) and `formula` (2-hour) events. Drives the expiration UI indicators (Green -> Yellow -> Red).
- `synced`: A planned flag to track which records have been pushed to a remote database.
