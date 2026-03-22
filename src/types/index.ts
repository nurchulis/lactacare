export type LogType = 'pumping' | 'asi' | 'formula';

export interface ActivityLog {
  id: string;
  type: LogType;
  created_at: number; // Unix timestamp
  next_reminder_at: number | null;
  expires_at: number | null;
}
