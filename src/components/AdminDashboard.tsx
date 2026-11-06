import React, { useState } from 'react';
import {
  Users,
  FileText,
  Activity,
  ShieldAlert,
  CheckCircle,
  Trash2,
  Pin,
  Flame,
  Search,
  Filter,
  RefreshCw,
  Server,
  Zap,
  Clock
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import type { Post } from '../types';

interface AdminDashboardProps {
  posts: Post[];
  onDeletePost: (id: string) => void;
  onNotify: (msg: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ posts, onDeletePost, onNotify }) => {
  const { currentUser } = useAuth();
  const [filterQuery, setFilterQuery] = useState('');
  const [pinnedPostIds, setPinnedPostIds] = useState<string[]>([]);
  const [userList, setUserList] = useState([
    { id: '1', name: 'Marcus Chen', handle: '@marcus_dev', role: 'Principal Architect', status: 'Active', postsCount: 14, verified: true },
    { id: '2', name: 'Elena Rostova', handle: '@elena_systems', role: 'Consensus Engineer', status: 'Active', postsCount: 8, verified: true },
    { id: '3', name: 'Tariq Al-Mansoor', handle: '@tariq_wasm', role: 'Rust Core Contributor', status: 'Active', postsCount: 5, verified: true },
    { id: '4', name: 'Suspicious Bot #829', handle: '@bot_relay', role: 'Scraper Node', status: 'Flagged', postsCount: 1, verified: false }
  ]);

  const togglePin = (postId: string) => {
    setPinnedPostIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId]
    );
    onNotify('Post pin state toggled by Admin.');
  };

  const handleBanUser = (id: string, name: string) => {
    setUserList((prev) => prev.map((u) => (u.id === id ? { ...u, status: 'Suspended' } : u)));
    onNotify(`User "${name}" has been suspended by Admin.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Admin Header Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#121629] via-[#101322] to-[#1a142e] border border-[#004ac6]/40 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#40c2fd]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#004ac6] text-white font-mono text-[11px] font-bold uppercase tracking-wider">
                Admin Console
              </span>
              <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                Cluster Healthy
              </span>
            </div>
            <h1 className="text-2xl font-black text-white mt-1">Platform Control & Analytics</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Logged in as <span className="text-[#40c2fd] font-bold">{currentUser.name}</span> ({currentUser.handle})
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNotify('System metrics refreshed live from Supabase & Cloudflare Edge.')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#181c2c] hover:bg-[#20253b] border border-[#737686]/30 text-xs font-semibold text-gray-200 transition-all shadow-md"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#40c2fd]" />
              <span>Refresh Metrics</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Active Users', value: '42,810', change: '+18% this week', icon: Users, color: 'text-[#40c2fd]' },
          { label: 'Published Posts', value: '1,492', change: '+38 today', icon: FileText, color: 'text-emerald-400' },
          { label: 'Edge Messages (24h)', value: '189,204', change: 'WhatsApp Relays', icon: Zap, color: 'text-amber-400' },
          { label: 'Cluster P99 Latency', value: '13.8 ms', change: '24 Edge Nodes', icon: Server, color: 'text-purple-400' }
        ].map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className="p-4 rounded-2xl bg-[#0f111c] border border-[#737686]/25 shadow-lg space-y-1">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-[11px] font-bold uppercase tracking-wider">{kpi.label}</span>
                <Icon className={`w-4 h-4 ${kpi.color}`} />
              </div>
              <div className="text-xl sm:text-2xl font-extrabold font-mono text-white mt-1">{kpi.value}</div>
              <span className="text-[10px] text-gray-400 block font-medium">{kpi.change}</span>
            </div>
          );
        })}
      </div>

      {/* Content Moderation Table */}
      <div className="p-5 rounded-3xl bg-[#0f111c] border border-[#737686]/25 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#737686]/20">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-[#40c2fd]" /> Post Moderation & Feed Control
            </h3>
            <p className="text-xs text-gray-400">Review, pin, or take action on posts published to the global stream</p>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search posts..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-[#141726] border border-[#737686]/25 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#40c2fd]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#737686]/20 text-gray-400 uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Post Title</th>
                <th className="py-2.5 px-3">Author</th>
                <th className="py-2.5 px-3">Category</th>
                <th className="py-2.5 px-3">Metrics</th>
                <th className="py-2.5 px-3 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#737686]/10">
              {posts.map((p) => {
                const isPinned = pinnedPostIds.includes(p.id);
                return (
                  <tr key={p.id} className="hover:bg-[#141726]/60 transition-colors">
                    <td className="py-3 px-3 font-semibold text-white max-w-xs truncate">
                      {isPinned && <span className="mr-1 text-amber-400">📌</span>}
                      {p.title}
                    </td>
                    <td className="py-3 px-3 text-gray-300">
                      <div className="flex items-center gap-1.5">
                        <img src={p.creator.avatar} alt="" className="w-5 h-5 rounded-full object-cover" />
                        <span>{p.creator.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-3">
                      <span className="px-2 py-0.5 rounded-full bg-[#181d30] text-[#40c2fd] font-mono text-[10px]">
                        {p.categoryTag}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-mono text-gray-400">
                      {p.stats.likes} likes • {p.stats.comments} comments
                    </td>
                    <td className="py-3 px-3 text-right space-x-1.5">
                      <button
                        onClick={() => togglePin(p.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          isPinned ? 'bg-amber-500/20 text-amber-400' : 'bg-[#181c2c] text-gray-400 hover:text-white'
                        }`}
                        title="Pin to top of feed"
                      >
                        <Pin className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeletePost(p.id)}
                        className="p-1.5 rounded-lg bg-[#ab0b1c]/20 hover:bg-[#ab0b1c]/40 text-[#ff2d55] transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Management Table */}
      <div className="p-5 rounded-3xl bg-[#0f111c] border border-[#737686]/25 shadow-xl space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#737686]/20">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-400" /> Platform Members & Roles
            </h3>
            <p className="text-xs text-gray-400">Manage user access privileges, staff badges, and moderation flags</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-[#737686]/20 text-gray-400 uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Member</th>
                <th className="py-2.5 px-3">Role</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Contributions</th>
                <th className="py-2.5 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#737686]/10">
              {userList.map((u) => (
                <tr key={u.id} className="hover:bg-[#141726]/60 transition-colors">
                  <td className="py-3 px-3 font-semibold text-white">
                    <div className="flex items-center gap-2">
                      <span>{u.name}</span>
                      <span className="text-[10px] text-gray-500 font-mono">{u.handle}</span>
                    </div>
                  </td>
                  <td className="py-3 px-3 text-gray-300">{u.role}</td>
                  <td className="py-3 px-3">
                    <span
                      className={`px-2 py-0.5 rounded-full font-mono text-[10px] ${
                        u.status === 'Active'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : u.status === 'Suspended'
                          ? 'bg-[#ab0b1c]/20 text-[#ff2d55]'
                          : 'bg-amber-500/20 text-amber-400'
                      }`}
                    >
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-gray-400">{u.postsCount} posts</td>
                  <td className="py-3 px-3 text-right">
                    {u.status !== 'Suspended' && (
                      <button
                        onClick={() => handleBanUser(u.id, u.name)}
                        className="px-2.5 py-1 rounded-lg bg-[#ab0b1c]/15 hover:bg-[#ab0b1c]/30 text-[#ff2d55] text-[11px] font-semibold transition-colors"
                      >
                        Suspend
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
