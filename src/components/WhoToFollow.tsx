import React, { useState } from 'react';
import { UserPlus, UserCheck, CheckCircle2 } from 'lucide-react';
import type { FollowSuggestion } from '../types';

interface WhoToFollowProps {
  suggestions: FollowSuggestion[];
  onNotify: (message: string) => void;
}

export const WhoToFollow: React.FC<WhoToFollowProps> = ({ suggestions, onNotify }) => {
  const [followingState, setFollowingState] = useState<Record<string, boolean>>({});

  const handleToggle = (item: FollowSuggestion) => {
    const isNow = !followingState[item.id];
    setFollowingState((prev) => ({ ...prev, [item.id]: isNow }));
    onNotify(isNow ? `Followed ${item.name}` : `Unfollowed ${item.name}`);
  };

  return (
    <div className="rounded-2xl bg-[#0f111c] border border-[#737686]/25 p-4 space-y-3.5 shadow-lg">
      <div className="flex items-center justify-between pb-1 border-b border-[#737686]/20">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
          Who to follow
        </h3>
        <span className="text-[10px] text-[#40c2fd] hover:underline cursor-pointer">
          Refresh
        </span>
      </div>

      <div className="space-y-3">
        {suggestions.map((user) => {
          const isFoll = !!followingState[user.id];
          return (
            <div key={user.id} className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-2.5 min-w-0">
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover ring-1 ring-white/10 shrink-0 mt-0.5"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-white hover:text-[#40c2fd] truncate cursor-pointer">
                      {user.name}
                    </span>
                    {user.verified && (
                      <CheckCircle2 className="w-3 h-3 text-[#40c2fd] shrink-0" />
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-gray-400 block truncate">
                    {user.handle}
                  </span>
                  <p className="text-[10px] text-gray-400 line-clamp-1 mt-0.5">
                    {user.role}
                  </p>
                </div>
              </div>

              <button
                onClick={() => handleToggle(user)}
                className={`p-1.5 px-3 rounded-full text-xs font-semibold shrink-0 transition-all ${
                  isFoll
                    ? 'bg-[#151928] text-emerald-400 border border-emerald-500/30'
                    : 'bg-[#141826] hover:bg-[#1d68ff] text-gray-200 hover:text-white border border-[#737686]/30 hover:border-transparent'
                }`}
              >
                {isFoll ? 'Following' : 'Follow'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
