import React, { useEffect } from 'react';
import { LogOut } from 'lucide-react';

interface QuickExitProps {
  className?: string;
}

export const QuickExit: React.FC<QuickExitProps> = ({ className = '' }) => {
  const handleExit = () => {
    // Redirect to a neutral site immediately and replace history
    window.location.replace('https://www.google.com');
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Pressing ESC triggers the quick exit
      if (e.key === 'Escape') {
        handleExit();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <button
      onClick={handleExit}
      className={`bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg shadow-sm transition-all hover:scale-105 active:scale-95 flex items-center gap-2 ${className}`}
      title="Press ESC to leave quickly"
    >
      <LogOut size={18} className="stroke-[3]" />
      <span className="uppercase tracking-wider text-xs font-black whitespace-nowrap hidden sm:inline">Quick Exit</span>
    </button>
  );
};
