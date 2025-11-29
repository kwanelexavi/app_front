import React from 'react';
import { PhoneCall, AlertOctagon } from 'lucide-react';

export const PanicButton: React.FC = () => {
  const handlePanic = () => {
    // In a real scenario, this would dial the local emergency number (e.g., 911, 112, 999)
    window.location.href = 'tel:911'; 
  };

  return (
    <button
      onClick={handlePanic}
      className="fixed bottom-6 left-6 group z-50 flex items-center justify-center"
      title="Emergency Panic Button"
    >
      {/* Pulsing effect */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75 animate-ping group-hover:animate-none"></span>
      
      <div className="relative bg-red-600 hover:bg-red-700 text-white h-14 w-14 md:w-auto md:px-6 md:h-14 rounded-full shadow-2xl transition-all transform hover:scale-105 border-2 border-red-400 flex items-center justify-center gap-2">
        <PhoneCall size={24} className="animate-pulse" />
        <span className="font-black tracking-wider hidden md:inline">PANIC</span>
      </div>
    </button>
  );
};
