import React from 'react';
import { Flame, TrendingUp } from 'lucide-react';
import type { TrendingTopic } from '../types';

interface TrendingTopicsProps {
  topics: TrendingTopic[];
  onSelectTopic: (topic: string) => void;
}

export const TrendingTopics: React.FC<TrendingTopicsProps> = ({ topics, onSelectTopic }) => {
  return (
    <div className="rounded-2xl bg-[#0f111c] border border-[#737686]/25 p-4 space-y-3.5 shadow-lg">
      <div className="flex items-center justify-between pb-1 border-b border-[#737686]/20">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-[#40c2fd]" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
            Trending in Engineering
          </h3>
        </div>
        <span className="text-[10px] text-[#40c2fd] hover:underline cursor-pointer">
          See all
        </span>
      </div>

      <div className="space-y-2">
        {topics.map((t, idx) => (
          <div
            key={t.id}
            onClick={() => onSelectTopic(t.topic)}
            className="p-2.5 rounded-xl hover:bg-[#141726] transition-colors cursor-pointer group flex items-start justify-between gap-2"
          >
            <div>
              <span className="text-[10px] font-mono text-gray-400 block">
                #{idx + 1} • {t.category}
              </span>
              <span className="text-xs font-bold text-gray-200 group-hover:text-[#40c2fd] transition-colors block mt-0.5">
                {t.topic}
              </span>
              <span className="text-[11px] text-gray-400 font-mono mt-0.5 block">
                {t.postsCount}
              </span>
            </div>

            {t.isHot && (
              <span className="px-1.5 py-0.5 rounded bg-[#ab0b1c]/20 text-[#ff2d55] text-[10px] font-bold flex items-center gap-0.5 shrink-0">
                <Flame className="w-2.5 h-2.5" /> HOT
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
