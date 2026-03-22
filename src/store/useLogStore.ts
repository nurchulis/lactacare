import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { addHours } from 'date-fns';
import type { ActivityLog, LogType } from '../types';

interface LogState {
  logs: ActivityLog[];
  addLog: (type: LogType, customTimestamp?: number) => void;
  removeLog: (id: string) => void;
  editLog: (id: string, newTimestamp: number) => void;
  clearLogs: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

const calculateTimers = (type: LogType, timestamp: number) => {
  let next_reminder_at: number | null = null;
  let expires_at: number | null = null;
  if (type === 'pumping') {
    next_reminder_at = addHours(timestamp, 3).getTime();
  } else if (type === 'asi') {
    expires_at = addHours(timestamp, 4).getTime();
  } else if (type === 'formula') {
    expires_at = addHours(timestamp, 2).getTime();
  }
  return { next_reminder_at, expires_at };
};

export const useLogStore = create<LogState>()(
  persist(
    (set) => ({
      logs: [],
      addLog: (type, customTimestamp) => {
        const now = customTimestamp || Date.now();
        const { next_reminder_at, expires_at } = calculateTimers(type, now);

        const newLog: ActivityLog = {
          id: generateId(),
          type,
          created_at: now,
          next_reminder_at,
          expires_at,
        };

        set((state) => ({ logs: [newLog, ...state.logs] }));
      },
      removeLog: (id) => set((state) => ({ logs: state.logs.filter((log) => log.id !== id) })),
      editLog: (id, newTimestamp) => set((state) => ({
        logs: state.logs.map(log => {
          if (log.id === id) {
            const { next_reminder_at, expires_at } = calculateTimers(log.type, newTimestamp);
            return { ...log, created_at: newTimestamp, next_reminder_at, expires_at };
          }
          return log;
        })
      })),
      clearLogs: () => set({ logs: [] }),
    }),
    {
      name: 'lactacare-storage', // saves to localStorage by default
      version: 1,
    }
  )
);
