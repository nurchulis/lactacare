import { useState } from 'react';
import { useLogStore } from '../store/useLogStore';
import type { LogType } from '../types';
import { Baby, Droplet, Milk, Clock, History } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { subMinutes } from 'date-fns';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const QuickActions: React.FC = () => {
  const addLog = useLogStore((state) => state.addLog);
  const [lastAction, setLastAction] = useState<string | null>(null);
  const [showPumpingOptions, setShowPumpingOptions] = useState(false);

  const handleAction = (type: LogType, label: string, timestamp?: number) => {
    addLog(type, timestamp);
    setLastAction(`Dicatat: ${label}`);
    
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }

    setShowPumpingOptions(false);
    setTimeout(() => setLastAction(null), 3000);
  };

  const handleDelayedPumping = (minutesAgo: number, label: string) => {
    const timestamp = subMinutes(Date.now(), minutesAgo).getTime();
    handleAction('pumping', label, timestamp);
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-xl font-bold text-gray-800">Aksi Cepat</h2>
      
      {!showPumpingOptions ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={() => handleAction('pumping', 'Mulai Pumping')}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95",
              "bg-pastel-green text-emerald-800"
            )}
          >
            <div className="mb-3 p-3 bg-white/50 rounded-full"><Droplet size={32} className="text-emerald-600" /></div>
            <span className="font-semibold text-lg">Mulai Pumping</span>
            <span className="text-xs font-medium opacity-70 mt-1">Sekarang</span>
          </button>
          
          <button
            onClick={() => setShowPumpingOptions(true)}
            className={cn(
              "flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-emerald-200 hover:bg-emerald-50 transition-all active:scale-95",
              "text-emerald-700 bg-white"
            )}
          >
            <div className="mb-3 p-3 bg-emerald-50 rounded-full"><History size={32} className="text-emerald-500" /></div>
            <span className="font-semibold text-lg">Sudah Pumping</span>
            <span className="text-xs font-medium opacity-70 mt-1">Pilih waktu lalu</span>
          </button>
        </div>
      ) : (
        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100 animate-[fadeIn_0.2s_ease-out]">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-emerald-800 flex items-center gap-2">
              <Clock size={18} /> Kapan selesai pumping?
            </h3>
            <button onClick={() => setShowPumpingOptions(false)} className="text-sm font-bold text-emerald-600 hover:text-emerald-800 p-1">Batal</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => handleDelayedPumping(30, 'Pumping 30mnt lalu')} className="bg-white p-3 rounded-lg shadow-sm text-sm font-semibold text-emerald-700 hover:bg-emerald-100 active:scale-95 transition-all">30 menit lalu</button>
            <button onClick={() => handleDelayedPumping(60, 'Pumping 1jam lalu')} className="bg-emerald-200 border-2 border-emerald-300 p-3 rounded-lg shadow-sm text-sm font-bold text-emerald-900 hover:bg-emerald-300 active:scale-95 transition-all">1 jam lalu</button>
            <button onClick={() => handleDelayedPumping(120, 'Pumping 2jam lalu')} className="bg-white p-3 rounded-lg shadow-sm text-sm font-semibold text-emerald-700 hover:bg-emerald-100 active:scale-95 transition-all">2 jam lalu</button>
            <button onClick={() => {
              const input = prompt("Berapa menit yang lalu? (Kosongkan untuk default 1 jam)", "60");
              if (input && !isNaN(Number(input))) {
                handleDelayedPumping(Number(input), `Pumping ${input}mnt lalu`);
              } else if (input === "") {
                handleDelayedPumping(60, 'Pumping 1jam lalu');
              }
            }} className="bg-emerald-600 text-white p-3 rounded-lg shadow-sm text-sm font-semibold hover:bg-emerald-700 active:scale-95 transition-all">Pilih sendiri</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 mt-2">
        <button
          onClick={() => handleAction('asi', 'Kasih ASI')}
          className={cn(
            "flex flex-col items-center justify-center p-5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95",
            "bg-pastel-yellow text-yellow-800"
          )}
        >
          <div className="mb-2 p-3 bg-white/50 rounded-full"><Baby size={28} className="text-yellow-600" /></div>
          <span className="font-semibold">Kasih ASI</span>
        </button>
        
        <button
          onClick={() => handleAction('formula', 'Buat Sufor')}
          className={cn(
            "flex flex-col items-center justify-center p-5 rounded-2xl shadow-sm hover:shadow-md transition-all active:scale-95",
            "bg-pastel-blue text-blue-800"
          )}
        >
          <div className="mb-2 p-3 bg-white/50 rounded-full"><Milk size={28} className="text-blue-600" /></div>
          <span className="font-semibold">Buat Sufor</span>
        </button>
      </div>
      
      {/* Toast feedback */}
      {lastAction && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3 rounded-full text-sm font-medium shadow-lg z-50">
          {lastAction}
        </div>
      )}
    </div>
  );
};
