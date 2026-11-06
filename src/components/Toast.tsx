import React, { useEffect } from 'react';
import { CheckCircle2, Info, X } from 'lucide-react';

export interface ToastProps {
  id: string;
  message: string;
  type?: 'success' | 'info';
  onClose: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ id, message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, 3500);
    return () => clearTimeout(timer);
  }, [id, onClose]);

  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-[#141724]/95 border border-[#40c2fd]/30 shadow-2xl backdrop-blur-md text-white transition-all transform animate-in fade-in slide-in-from-bottom-3 duration-300">
      {type === 'success' ? (
        <CheckCircle2 className="w-5 h-5 text-[#40c2fd] shrink-0" />
      ) : (
        <Info className="w-5 h-5 text-[#1d68ff] shrink-0" />
      )}
      <span className="text-sm font-medium tracking-wide">{message}</span>
      <button
        onClick={() => onClose(id)}
        className="ml-2 text-gray-400 hover:text-white p-1 rounded-lg transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
