import { useEffect, useState } from 'react';
import { useLogStore } from '../store/useLogStore';
import type { ActivityLog } from '../types';
import { Clock, AlertCircle } from 'lucide-react';
import { formatDistanceToNowStrict } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const TimerCard: React.FC<{ log: ActivityLog }> = ({ log }) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const targetTime = log.expires_at || log.next_reminder_at;
  if (!targetTime) return null;

  const totalDuration = log.expires_at 
    ? (log.type === 'asi' ? 4 * 60 * 60 * 1000 : 2 * 60 * 60 * 1000)
    : (3 * 60 * 60 * 1000);

  const timeRemaining = targetTime - now;
  const progress = Math.max(0, timeRemaining / totalDuration);
  const isExpired = timeRemaining <= 0;
  
  let statusColor = 'bg-pastel-green text-green-800';
  let iconColor = 'text-green-600';
  if (isExpired) {
    statusColor = 'bg-pastel-red text-red-800';
    iconColor = 'text-red-600';
  } else if (progress <= 0.25) {
    statusColor = 'bg-pastel-yellow text-yellow-800';
    iconColor = 'text-yellow-600';
  }

  const label = log.type === 'pumping' ? 'Jadwal Pumping' : (log.type === 'asi' ? 'Batas Waktu ASI' : 'Batas Waktu Sufor');
  
  const timeText = isExpired 
    ? (log.type === 'pumping' ? 'Sudah Lewat!' : 'Kadetluarsa!')
    : formatDistanceToNowStrict(targetTime, { locale: localeId });

  return (
    <div className={cn("p-4 rounded-xl flex items-center justify-between shadow-sm transition-colors duration-500", statusColor)}>
      <div className="flex items-center gap-3">
        {isExpired ? <AlertCircle className={iconColor} size={24} /> : <Clock className={iconColor} size={24} />}
        <div>
          <h3 className="font-semibold text-sm opacity-80">{label}</h3>
          <p className="font-bold text-lg">{timeText}</p>
        </div>
      </div>
      {!isExpired && (
        <div className="w-10 h-10 rounded-full flex items-center justify-center border-4 border-white/40" style={{
          background: `conic-gradient(currentColor ${progress * 100}%, transparent 0)`
        }}>
          <span className="sr-only">{Math.round(progress * 100)}%</span>
        </div>
      )}
    </div>
  );
};

export const ActiveTimers: React.FC = () => {
  const logs = useLogStore((state) => state.logs);
  
  const activeLogs = logs
    .filter(log => log.expires_at || log.next_reminder_at)
    .sort((a, b) => {
      const aTime = a.expires_at || a.next_reminder_at || 0;
      const bTime = b.expires_at || b.next_reminder_at || 0;
      return aTime - bTime;
    })
    .slice(0, 3); // Showing at most 3 active timers

  if (activeLogs.length === 0) return null;

  return (
    <div className="flex flex-col gap-3">
      <h2 className="text-xl font-bold text-gray-800">Batas Waktu</h2>
      <div className="flex flex-col gap-2">
        {activeLogs.map(log => (
          <TimerCard key={log.id} log={log} />
        ))}
      </div>
    </div>
  );
};
