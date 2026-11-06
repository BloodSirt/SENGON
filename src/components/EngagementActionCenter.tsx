import React, { useState } from 'react';
import {
  Heart,
  MessageSquare,
  Repeat2,
  Bookmark,
  Share2,
  Check,
  Eye
} from 'lucide-react';

interface EngagementActionCenterProps {
  initialLikes: number;
  commentsCount: number;
  initialReposts: number;
  initialBookmarks: number;
  views: string;
  reactedAvatars: string[];
  onScrollToComments: () => void;
  onShare: () => void;
  onNotify: (message: string) => void;
}

export const EngagementActionCenter: React.FC<EngagementActionCenterProps> = ({
  initialLikes,
  commentsCount,
  initialReposts,
  initialBookmarks,
  views,
  reactedAvatars,
  onScrollToComments,
  onShare,
  onNotify,
}) => {
  const [likes, setLikes] = useState(initialLikes);
  const [isLiked, setIsLiked] = useState(false);

  const [reposts, setReposts] = useState(initialReposts);
  const [isReposted, setIsReposted] = useState(false);

  const [bookmarks, setBookmarks] = useState(initialBookmarks);
  const [isBookmarked, setIsBookmarked] = useState(false);

  const handleToggleLike = () => {
    if (isLiked) {
      setLikes((prev) => prev - 1);
      setIsLiked(false);
      onNotify('Like removed');
    } else {
      setLikes((prev) => prev + 1);
      setIsLiked(true);
      onNotify('Added to your Liked Posts ❤️');
    }
  };

  const handleToggleRepost = () => {
    if (isReposted) {
      setReposts((prev) => prev - 1);
      setIsReposted(false);
      onNotify('Repost removed');
    } else {
      setReposts((prev) => prev + 1);
      setIsReposted(true);
      onNotify('Reposted to your network 🔁');
    }
  };

  const handleToggleBookmark = () => {
    if (isBookmarked) {
      setBookmarks((prev) => prev - 1);
      setIsBookmarked(false);
      onNotify('Removed from Bookmarks');
    } else {
      setBookmarks((prev) => prev + 1);
      setIsBookmarked(true);
      onNotify('Saved to Bookmarks 🔖');
    }
  };

  return (
    <div className="py-4 border-y border-[#737686]/20 space-y-3.5 my-4">
      {/* Metrics Row + Reacted Avatars */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-gray-400">
        
        <div className="flex items-center gap-5 sm:gap-6 font-medium">
          <div className="flex items-center gap-1.5 hover:text-white transition-colors">
            <span className="font-bold text-gray-200 font-mono">{likes.toLocaleString()}</span>
            <span className="text-gray-400">Likes</span>
          </div>

          <div
            onClick={onScrollToComments}
            className="flex items-center gap-1.5 hover:text-white transition-colors cursor-pointer"
          >
            <span className="font-bold text-gray-200 font-mono">{commentsCount.toLocaleString()}</span>
            <span className="text-gray-400">Comments</span>
          </div>

          <div className="flex items-center gap-1.5 hover:text-white transition-colors">
            <span className="font-bold text-gray-200 font-mono">{reposts.toLocaleString()}</span>
            <span className="text-gray-400">Reposts</span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-gray-500 font-mono text-xs">
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            <span>{views} Views</span>
          </div>
        </div>

        {/* Mini Reacted Avatars Cluster */}
        <div className="flex items-center gap-2">
          <div className="flex -space-x-2 overflow-hidden items-center">
            {reactedAvatars.map((badge, idx) => (
              <div
                key={idx}
                className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#1c2030] ring-2 ring-[#090a10] text-[10px] font-bold text-[#40c2fd] shadow-sm uppercase font-mono"
              >
                {badge}
              </div>
            ))}
          </div>
          <span className="text-[11px] text-gray-400 hidden xs:inline">
            reacted
          </span>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex items-center justify-between gap-2 pt-1">
        <div className="flex items-center gap-1.5 sm:gap-3 flex-wrap">
          {/* Like Button */}
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 group ${
              isLiked
                ? 'bg-[#ab0b1c]/25 border border-[#ff2d55]/70 text-[#ff2d55] shadow-lg shadow-[#ab0b1c]/30'
                : 'bg-[#12141f] hover:bg-[#1a1d2d] border border-[#737686]/30 text-gray-300 hover:text-white'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-transform group-hover:scale-125 duration-200 ${
                isLiked
                  ? 'fill-[#ff2d55] text-[#ff2d55] scale-110'
                  : 'text-gray-400 group-hover:text-[#ff2d55]'
              }`}
            />
            <span className="font-mono">{likes.toLocaleString()}</span>
            <span className="hidden sm:inline font-normal">Like</span>
          </button>

          {/* Comment Button */}
          <button
            onClick={onScrollToComments}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full bg-[#12141f] hover:bg-[#1a1d2d] border border-[#737686]/30 hover:border-[#40c2fd]/50 text-gray-300 hover:text-white text-xs sm:text-sm font-semibold transition-all group"
          >
            <MessageSquare className="w-4 h-4 text-gray-400 group-hover:text-[#40c2fd] transition-colors" />
            <span className="font-mono">{commentsCount.toLocaleString()}</span>
            <span className="hidden sm:inline font-normal">Comment</span>
          </button>

          {/* Repost Button */}
          <button
            onClick={handleToggleRepost}
            className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all group ${
              isReposted
                ? 'bg-emerald-500/20 border border-emerald-500/60 text-emerald-400 shadow-md'
                : 'bg-[#12141f] hover:bg-[#1a1d2d] border border-[#737686]/30 text-gray-300 hover:text-white'
            }`}
          >
            <Repeat2
              className={`w-4 h-4 transition-transform group-hover:rotate-180 duration-300 ${
                isReposted
                  ? 'text-emerald-400'
                  : 'text-gray-400 group-hover:text-emerald-400'
              }`}
            />
            <span className="font-mono">{reposts.toLocaleString()}</span>
            <span className="hidden sm:inline font-normal">Repost</span>
          </button>
        </div>

        {/* Additional Small Round Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Bookmark Round Button */}
          <button
            onClick={handleToggleBookmark}
            className={`p-2.5 rounded-full border transition-all duration-200 group ${
              isBookmarked
                ? 'bg-[#004ac6]/25 border-[#40c2fd]/60 text-[#40c2fd] shadow-md shadow-[#004ac6]/30'
                : 'bg-[#12141f] hover:bg-[#1a1d2d] border-[#737686]/30 text-gray-400 hover:text-white'
            }`}
            title={isBookmarked ? 'Saved in Bookmarks' : 'Bookmark this post'}
            aria-label="Bookmark"
          >
            <Bookmark
              className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                isBookmarked ? 'fill-[#40c2fd] text-[#40c2fd]' : ''
              }`}
            />
          </button>

          {/* Share Round Button */}
          <button
            onClick={onShare}
            className="p-2.5 rounded-full bg-[#12141f] hover:bg-[#1a1d2d] border border-[#737686]/30 hover:border-[#40c2fd]/50 text-gray-400 hover:text-white transition-all group shadow-sm"
            title="Share or Copy Link"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4 group-hover:text-[#40c2fd] transition-colors group-hover:scale-110" />
          </button>
        </div>
      </div>
    </div>
  );
};
