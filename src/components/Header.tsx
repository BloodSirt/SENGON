import React from 'react';
import { Search, Plus, Bell, Command, Menu, Sparkles, Layers } from 'lucide-react';

interface HeaderProps {
  onOpenSearch: () => void;
  onOpenCreatePost: () => void;
  onToggleMobileNav: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSearch,
  onOpenCreatePost,
  onToggleMobileNav,
}) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 bg-[#090a10]/90 backdrop-blur-xl border-b border-[#737686]/20">
      <div className="max-w-[1600px] mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        
        {/* Left: Logo & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileNav}
            className="lg:hidden p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label="Toggle Navigation"
          >
            <Menu className="w-5 h-5" />
          </button>

          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#004ac6] via-[#1d68ff] to-[#40c2fd] flex items-center justify-center shadow-lg shadow-[#004ac6]/30 group-hover:scale-105 transition-transform duration-200">
              <Layers className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-[#f0f3fa] to-[#c3c6d7] bg-clip-text text-transparent">
                SENGON
              </span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-[#40c2fd]/90 -mt-1 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5" /> AntiGravity
              </span>
            </div>
          </a>
        </div>

        {/* Center: Search Bar with ⌘K */}
        <div className="flex-1 max-w-xl mx-2 hidden sm:block">
          <button
            type="button"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-4 py-2 rounded-full bg-[#12141e] hover:bg-[#181b27] border border-[#737686]/30 hover:border-[#40c2fd]/40 text-gray-400 hover:text-gray-200 transition-all duration-200 text-sm group shadow-inner"
          >
            <div className="flex items-center gap-2.5">
              <Search className="w-4 h-4 text-gray-400 group-hover:text-[#40c2fd] transition-colors" />
              <span className="text-xs sm:text-sm font-normal text-gray-400">
                Search discussions, architecture, creators...
              </span>
            </div>
            <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#1d202d] border border-[#737686]/40 text-[11px] font-mono font-medium text-gray-300">
              <Command className="w-3 h-3 text-gray-400" />
              <span>K</span>
            </div>
          </button>
        </div>

        {/* Right: Actions & User Avatar */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenSearch}
            className="sm:hidden p-2 text-gray-400 hover:text-white rounded-full hover:bg-white/5 transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenCreatePost}
            className="flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-[#004ac6] to-[#1d68ff] hover:from-[#1d68ff] hover:to-[#40c2fd] text-white text-xs sm:text-sm font-semibold shadow-lg shadow-[#004ac6]/25 hover:shadow-[#1d68ff]/40 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden xs:inline">Create Post</span>
          </button>

          <button
            className="relative p-2 text-gray-400 hover:text-white rounded-full hover:bg-[#181b27] border border-transparent hover:border-[#737686]/30 transition-all"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#40c2fd] ring-2 ring-[#090a10] animate-pulse" />
          </button>

          <div className="flex items-center gap-2 pl-1 border-l border-[#737686]/30">
            <button className="relative group rounded-full p-0.5 ring-2 ring-[#1d68ff]/40 hover:ring-[#40c2fd] transition-all">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Your Profile"
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#090a10]" />
            </button>
          </div>
        </div>

      </div>
    </header>
  );
};
