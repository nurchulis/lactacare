import { useEffect, useState } from 'react';
import { useLogStore } from '../store/useLogStore';
import type { ActivityLog } from '../types';
import { Clock, AlertCircle, BellRing } from 'lucide-react';
import { formatDistanceToNowStrict, format } from 'date-fns';
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

  const elapsed = now - log.created_at;
  const progress = Math.min(Math.max(elapsed / totalDuration, 0), 1);
  const timeRemaining = targetTime - now;
  const isExpired = timeRemaining <= 0;
  
  let statusColor = 'bg-pastel-green text-green-800';
  let iconColor = 'text-green-600';
  let dividerColor = 'border-green-200/60';
  
  if (isExpired) {
    statusColor = 'bg-pastel-red text-red-800';
    iconColor = 'text-red-600';
    dividerColor = 'border-red-200/60';
  } else if (progress >= 0.75) {
    statusColor = 'bg-pastel-yellow text-yellow-800';
    iconColor = 'text-yellow-600';
    dividerColor = 'border-yellow-200/60';
  }

  const label = log.type === 'pumping' ? 'Pumping berikutnya' : (log.type === 'asi' ? 'Batas Waktu ASI' : 'Batas Waktu Sufor');
  
  const absoluteTime = format(targetTime, 'HH:mm');
  const distText = formatDistanceToNowStrict(targetTime, { locale: localeId });
  
  const timeText = isExpired 
    ? (log.type === 'pumping' ? 'Masa Pumping Lewat!' : 'Sudah Kedaluwarsa!')
    : `${absoluteTime} (${distText} lagi)`;

  return (
    <div className={cn("p-4 rounded-xl flex flex-col gap-3 shadow-sm transition-colors duration-500", statusColor)}>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1 w-full mr-2">
          <div className="flex items-center gap-2">
            {isExpired ? <AlertCircle className={iconColor} size={18} /> : <Clock className={iconColor} size={18} />}
            <h3 className="font-semibold text-sm opacity-80">{label}</h3>
          </div>
          <p className="font-bold text-[17px] leading-tight break-words">{timeText}</p>
        </div>
        {!isExpired && (
          <div className="relative w-10 h-10 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 40 40">
              <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="4" fill="transparent" className="opacity-30" />
              <circle 
                cx="20" 
                cy="20" 
                r="16" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="transparent" 
                strokeDasharray={2 * Math.PI * 16} 
                strokeDashoffset={(2 * Math.PI * 16) * (1 - progress)} 
                strokeLinecap="round" 
                className="transition-all duration-1000 ease-linear" 
              />
            </svg>
            <span className="sr-only">{Math.round(progress * 100)}%</span>
          </div>
        )}
      </div>

      {log.type === 'pumping' && !isExpired && (
        <div className={cn("flex flex-col gap-2 mt-1 pt-3 border-t", dividerColor)}>
          <a
            href="shortcuts://run-shortcut?name=Set%20Pumping"
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-semibold flex items-center justify-center py-2.5 rounded-lg transition-all shadow-md text-sm gap-2"
          >
            <BellRing size={16} className="animate-pulse" />
            Set Alarm di iPhone
          </a>
          <p className="text-[11px] font-medium opacity-80 leading-tight italic text-center px-1">
            Agar tidak terlewat, gunakan alarm iPhone
          </p>
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
    .slice(0, 3);

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
