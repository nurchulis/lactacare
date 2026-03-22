import { useEffect, useState } from 'react';
import { useLogStore } from '../store/useLogStore';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Droplet, Baby, Milk, Trash2, Edit2, Plus, Minus, X } from 'lucide-react';

export const Timeline: React.FC = () => {
  const { logs, removeLog, editLog } = useLogStore();
  const [, setNow] = useState(Date.now());
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 60000);
    return () => clearInterval(interval);
  }, []);

  const getLogDetails = (type: string) => {
    switch (type) {
      case 'pumping': return { label: 'Pumping', icon: <Droplet size={18} />, color: 'bg-emerald-100 text-emerald-800' };
      case 'asi': return { label: 'Beri ASI', icon: <Baby size={18} />, color: 'bg-yellow-100 text-yellow-800' };
      case 'formula': return { label: 'Buat Sufor', icon: <Milk size={18} />, color: 'bg-blue-100 text-blue-800' };
      default: return { label: 'Aktivitas', icon: <Droplet size={18} />, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const adjustTime = (id: string, currentTimestamp: number, offsetMinutes: number) => {
    const newTimestamp = currentTimestamp + (offsetMinutes * 60 * 1000);
    if (newTimestamp > Date.now()) {
      alert("Waktu tidak bisa di masa depan!");
      return;
    }
    editLog(id, newTimestamp);
  };

  if (logs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-400 text-center border-2 border-dashed border-gray-200 rounded-xl mt-4">
        <p>Belum ada aktivitas.</p>
        <p className="text-sm">Catat aktivitas di atas untuk memulai.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 mt-6">
      <h2 className="text-xl font-bold text-gray-800">Riwayat</h2>
      <div className="flex flex-col gap-3 relative">
        <div className="absolute left-[19px] top-6 bottom-6 w-0.5 bg-gray-200 z-0"></div>
        {logs.map((log) => {
          const details = getLogDetails(log.type);
          const isEditing = editingId === log.id;
          
          return (
            <div key={log.id} className="flex gap-4 relative z-10 group">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-white shadow-sm ${details.color}`}>
                {details.icon}
              </div>
              <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center transition-colors">
                
                {/* Normal View */}
                {!isEditing && (
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="font-semibold text-gray-800">{details.label}</h4>
                      <p className="text-xs text-gray-500 font-medium">{format(log.created_at, 'HH:mm · d MMM', { locale: localeId })}</p>
                    </div>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => setEditingId(log.id)}
                        className="p-2 text-gray-300 hover:text-blue-500 transition-colors rounded-full hover:bg-blue-50"
                        aria-label="Edit waktu"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => removeLog(log.id)}
                        className="p-2 text-gray-300 hover:text-red-500 transition-colors rounded-full hover:bg-red-50"
                        aria-label="Hapus log"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Edit View */}
                {isEditing && (
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center text-sm font-semibold text-gray-700">
                      <span>Ubah Waktu ({format(log.created_at, 'HH:mm')})</span>
                      <button onClick={() => setEditingId(null)} className="p-1 rounded-full text-gray-400 hover:bg-gray-100"><X size={16} /></button>
                    </div>
                    <div className="flex justify-between gap-2">
                       <button onClick={() => adjustTime(log.id, log.created_at, -15)} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 text-gray-700"><Minus size={14}/> 15m</button>
                       <button onClick={() => adjustTime(log.id, log.created_at, 15)} className="flex-1 bg-gray-100 hover:bg-gray-200 py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-1 text-gray-700"><Plus size={14}/> 15m</button>
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
