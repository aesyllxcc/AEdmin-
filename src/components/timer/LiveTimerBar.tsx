import React from 'react';
import { Play, Pause, Square, Clock, ArrowRight } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function LiveTimerBar() {
  const { activeTimer, pauseTimer, resumeTimer, stopTimer, updateActiveTimerNotes, clients } = useApp();

  if (!activeTimer.isRunning) return null;

  const currentClient = clients.find(c => c.id === activeTimer.clientId);

  const formatTimer = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed bottom-6 right-8 z-40 animate-in slide-in-from-bottom-5 duration-300">
      <div className="bg-sidebar-bg text-white px-5 py-3.5 rounded-full shadow-2xl border border-white/10 flex items-center gap-4 backdrop-blur-md">
        
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-base font-medium tracking-tight">
            {formatTimer(activeTimer.seconds)}
          </span>
        </div>

        <div className="h-4 w-px bg-white/20" />

        <div className="flex flex-col max-w-[200px] truncate">
          <span className="text-xs font-semibold text-card-yellow truncate">
            {currentClient?.name || 'General Session'}
          </span>
          <span className="text-[10px] text-gray-400 truncate">
            {activeTimer.isBillable ? 'Billable Session' : 'Non-Billable Internal'}
          </span>
        </div>

        <div className="flex items-center gap-1.5 ml-2">
          {activeTimer.isPaused ? (
            <button 
              onClick={resumeTimer}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Resume Timer"
            >
              <Play className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button 
              onClick={pauseTimer}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Pause Timer"
            >
              <Pause className="w-4 h-4 fill-current" />
            </button>
          )}

          <button 
            onClick={() => stopTimer(true)}
            className="p-2 rounded-full bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
            title="Stop & Log Entry"
          >
            <Square className="w-4 h-4 fill-current" />
          </button>
        </div>

      </div>
    </div>
  );
}
