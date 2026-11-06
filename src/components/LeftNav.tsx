import React from 'react';
import {
  Home,
  Compass,
  Bell,
  MessageSquare,
  Bookmark,
  User,
  Settings,
  ShieldAlert,
  Flame,
  Cpu,
  Layers,
  ChevronRight,
  ShieldCheck,
  X,
  LogIn
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface LeftNavProps {
  activeNav: string;
  onSelectNav: (id: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenMessenger: () => void;
}

export const LeftNav: React.FC<LeftNavProps> = ({
  activeNav,
  onSelectNav,
  isOpenMobile,
  onCloseMobile,
  onOpenMessenger,
}) => {
  const { currentUser, openLoginModal } = useAuth();

  const mainNavItems = [
    { id: 'home', label: 'Home Feed', icon: Home, count: undefined },
    { id: 'explore', label: 'Explore & Circles', icon: Compass, count: undefined },
    { id: 'messages', label: 'WhatsApp Chat', icon: MessageSquare, count: 4, action: onOpenMessenger },
    { id: 'notifications', label: 'Notifications', icon: Bell, count: 2 },
    { id: 'admin', label: 'Admin Dashboard', icon: ShieldAlert, count: undefined, badge: 'PRO' },
    { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark, count: undefined },
    { id: 'profile', label: 'Profile Dossier', icon: User, count: undefined },
    { id: 'settings', label: 'Settings', icon: Settings, count: undefined },
  ];

  const spaces = [
    { id: 'crdt-wg', label: 'CRDT & Edge WG', icon: Layers, activeCount: '1.2k online' },
    { id: 'webgpu-perf', label: 'WebGPU Benchmarks', icon: Cpu, activeCount: '840 online' },
    { id: 'wasm-sys', label: 'Rust & WASM Core', icon: Flame, activeCount: '490 online' },
  ];

  const content = (
    <div className="flex flex-col h-full py-4 px-3 sm:px-4 space-y-5 overflow-y-auto">
      {/* Mobile close button */}
      <div className="flex items-center justify-between lg:hidden pb-3 border-b border-[#737686]/20">
        <span className="text-sm font-bold text-gray-300">Navigation</span>
        <button
          onClick={onCloseMobile}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User Session Quick Card in Nav */}
      <div
        onClick={openLoginModal}
        className="p-3 rounded-2xl bg-[#121524] border border-[#737686]/20 hover:border-[#40c2fd]/40 transition-all cursor-pointer group"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <img src={currentUser.avatar} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-[#40c2fd]/40" />
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#121524]" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white truncate">{currentUser.name}</span>
              {currentUser.isAdmin && (
                <span className="px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-400 text-[9px] font-bold">
                  ADMIN
                </span>
              )}
            </div>
            <span className="text-[10px] text-gray-400 font-mono truncate block">{currentUser.handle}</span>
          </div>
          <LogIn className="w-3.5 h-3.5 text-gray-500 group-hover:text-[#40c2fd] transition-colors" />
        </div>
      </div>

      {/* Section 1: Feeds & Navigation */}
      <div>
        <div className="px-3 mb-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0b4]/70 font-mono">
            Platform Navigation
          </span>
        </div>
        <nav className="space-y-1">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNav === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    onSelectNav(item.id);
                  }
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-[#004ac6]/20 to-[#1d68ff]/10 text-white font-semibold border-l-4 border-[#40c2fd] shadow-sm'
                    : 'text-gray-400 hover:text-gray-100 hover:bg-[#151824]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-[#40c2fd]' : 'text-gray-400 group-hover:text-gray-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                <div className="flex items-center gap-1.5">
                  {item.badge && (
                    <span className="px-1.5 py-0.2 rounded bg-[#004ac6]/30 text-[#40c2fd] text-[9px] font-mono font-bold">
                      {item.badge}
                    </span>
                  )}
                  {item.count !== undefined && (
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono transition-transform duration-200 ${
                        isActive ? 'bg-[#40c2fd] text-[#090a10]' : 'bg-[#1e2230] text-[#40c2fd] group-hover:scale-105'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Section 2: Starred Circles */}
      <div>
        <div className="px-3 mb-2 flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#9aa0b4]/70 font-mono">
            Active Circles
          </span>
          <span className="text-[10px] text-[#40c2fd] hover:underline cursor-pointer">Browse</span>
        </div>
        <div className="space-y-1">
          {spaces.map((space) => {
            const Icon = space.icon;
            return (
              <button
                key={space.id}
                onClick={() => onSelectNav('explore')}
                className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-medium text-gray-400 hover:text-white hover:bg-[#151824] transition-all group"
              >
                <div className="flex items-center gap-2.5 truncate">
                  <div className="p-1.5 rounded-lg bg-[#181c28] group-hover:bg-[#1d68ff]/20 text-gray-400 group-hover:text-[#40c2fd] transition-colors">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="truncate">{space.label}</span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">{space.activeCount}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom: Pro / Verified Banner */}
      <div className="mt-auto pt-2">
        <div className="p-3.5 rounded-2xl bg-gradient-to-br from-[#121626] to-[#10121d] border border-[#1d68ff]/30 shadow-lg relative overflow-hidden group">
          <div className="flex items-start gap-2.5 relative">
            <div className="p-2 rounded-xl bg-[#004ac6]/20 text-[#40c2fd] shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">AntiGravity Edge Node</h4>
              <p className="text-[11px] text-gray-400 mt-0.5 leading-snug">Connected to Regional Peer Mesh #US-WEST-4</p>
            </div>
          </div>
          <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              14ms Latency
            </span>
            <span className="text-gray-400 hover:text-white flex items-center gap-0.5 cursor-pointer">
              Telemetry <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden lg:block fixed top-16 left-0 bottom-0 w-64 bg-[#090a10]/80 backdrop-blur-md border-r border-[#737686]/20 z-30">
        {content}
      </aside>

      {isOpenMobile && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" onClick={onCloseMobile} />
          <div className="relative w-72 max-w-[80vw] bg-[#0c0e17] border-r border-[#737686]/30 h-full z-10 shadow-2xl">
            {content}
          </div>
        </div>
      )}
    </>
  );
};
