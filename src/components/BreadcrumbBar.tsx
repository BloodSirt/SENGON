import React from 'react';
import { ArrowLeft, ChevronRight, Share2, MoreHorizontal } from 'lucide-react';

interface BreadcrumbBarProps {
  category: string;
  postId: string;
  onBackToFeed: () => void;
  onShare: () => void;
}

export const BreadcrumbBar: React.FC<BreadcrumbBarProps> = ({
  category,
  postId,
  onBackToFeed,
  onShare,
}) => {
  return (
    <div className="flex items-center justify-between py-3 px-2 sm:px-0 text-sm border-b border-[#737686]/15 mb-4">
      {/* Left: Back button & Breadcrumb path */}
      <div className="flex items-center gap-3 overflow-hidden">
        <button
          onClick={onBackToFeed}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131520] hover:bg-[#1a1e2e] border border-[#737686]/30 text-gray-300 hover:text-white transition-all text-xs font-semibold group shrink-0"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-gray-400 group-hover:text-[#40c2fd] transition-transform group-hover:-translate-x-0.5" />
          <span>Back to Feed</span>
        </button>

        <div className="flex items-center gap-1.5 text-xs text-gray-400 font-medium truncate">
          <span className="hover:text-gray-200 cursor-pointer transition-colors truncate">
            {category}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-gray-600 shrink-0" />
          <span className="text-[#40c2fd] font-mono font-semibold shrink-0">
            Post #{postId}
          </span>
        </div>
      </div>

      {/* Right: Quick actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          onClick={onShare}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#151824] transition-colors"
          title="Share Post"
          aria-label="Share Post"
        >
          <Share2 className="w-4 h-4" />
        </button>
        <button
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#151824] transition-colors"
          title="More Options"
          aria-label="More Options"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
