import React from 'react';
import { Hash } from 'lucide-react';

interface RelatedCirclesProps {
  circles: string[];
  onSelectCircle: (tag: string) => void;
}

export const RelatedCircles: React.FC<RelatedCirclesProps> = ({ circles, onSelectCircle }) => {
  return (
    <div className="rounded-2xl bg-[#0f111c] border border-[#737686]/25 p-4 space-y-3 shadow-lg">
      <div className="flex items-center justify-between pb-1 border-b border-[#737686]/20">
        <h3 className="text-xs font-bold uppercase tracking-wider text-gray-200">
          Related Circles
        </h3>
        <span className="text-[10px] text-[#40c2fd] hover:underline cursor-pointer">
          Explore
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        {circles.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectCircle(tag)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#141726] hover:bg-[#1b2238] border border-[#737686]/25 hover:border-[#40c2fd]/50 text-xs font-mono text-gray-300 hover:text-[#40c2fd] transition-all group"
          >
            <Hash className="w-3 h-3 text-[#40c2fd] group-hover:rotate-12 transition-transform" />
            <span>{tag.replace('#', '')}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

