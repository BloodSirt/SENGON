import React, { useState, useEffect } from 'react';
import { Search, X, Sparkles, ArrowRight, Hash, User, FileText } from 'lucide-react';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectResult: (query: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectResult,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        onClose(); // toggle if already open or parent handles
      }
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const quickSuggestions = [
    { type: 'post', label: 'Rebuilding our distributed layout canvas with reactive edge nodes', meta: 'Post #84912' },
    { type: 'creator', label: 'Marcus Chen (@marcus_dev)', meta: 'Principal Architect' },
    { type: 'tag', label: '#DistributedSystems', meta: '2.4k posts' },
    { type: 'tag', label: '#WebGPU', meta: '1.8k posts' },
    { type: 'tag', label: '#CRDT', meta: '940 posts' },
  ];

  const filteredSuggestions = searchTerm
    ? quickSuggestions.filter((item) =>
        item.label.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : quickSuggestions;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0f111c] border border-[#737686]/30 shadow-2xl overflow-hidden">
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-[#737686]/20 bg-[#121422]">
          <Search className="w-5 h-5 text-gray-400 mr-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search discussions, architectural RFCs, creators, tags..."
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-gray-500 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Suggestions list */}
        <div className="p-3 max-h-96 overflow-y-auto space-y-1">
          <span className="px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-gray-500 block">
            Suggested Results
          </span>

          {filteredSuggestions.map((item, idx) => (
            <div
              key={idx}
              onClick={() => {
                onSelectResult(item.label);
                onClose();
              }}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-[#161a2b] cursor-pointer group transition-colors"
            >
              <div className="flex items-center gap-3">
                {item.type === 'post' && <FileText className="w-4 h-4 text-[#40c2fd]" />}
                {item.type === 'creator' && <User className="w-4 h-4 text-emerald-400" />}
                {item.type === 'tag' && <Hash className="w-4 h-4 text-purple-400" />}
                <span className="text-xs sm:text-sm font-medium text-gray-200 group-hover:text-white">
                  {item.label}
                </span>
              </div>
              <span className="text-[11px] font-mono text-gray-500 group-hover:text-gray-400">
                {item.meta}
              </span>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="px-4 py-2.5 bg-[#0b0c14] border-t border-[#737686]/15 flex items-center justify-between text-[11px] text-gray-500">
          <span>Navigate with <b>↑</b> <b>↓</b> keys</span>
          <span>Press <b>ESC</b> to exit</span>
        </div>
      </div>
    </div>
  );
};

