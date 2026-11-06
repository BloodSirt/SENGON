import React from 'react';
import {
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
  Bookmark,
  MoreHorizontal,
  ExternalLink,
  Hash
} from 'lucide-react';
import type { Post } from '../types';
import { MediaCarousel } from './MediaCarousel';
import { EngagementActionCenter } from './EngagementActionCenter';

interface PostCardProps {
  post: Post;
  commentsCount: number;
  onOpenLightbox: (slideIndex: number) => void;
  onScrollToComments: () => void;
  onSelectHashtag: (tag: string) => void;
  onShare: () => void;
  onNotify: (msg: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({
  post,
  commentsCount,
  onOpenLightbox,
  onScrollToComments,
  onSelectHashtag,
  onShare,
  onNotify,
}) => {
  return (
    <article className="rounded-3xl bg-[#0f111c] border border-[#737686]/25 p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Subtle background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#004ac6]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Creator Identity Row */}
      <div className="flex items-start justify-between gap-4 pb-4">
        <div className="flex items-start gap-3.5">
          <div className="relative group cursor-pointer">
            <img
              src={post.creator.avatar}
              alt={post.creator.name}
              className="w-12 h-12 rounded-2xl object-cover ring-2 ring-[#004ac6]/50 shadow-md transition-transform group-hover:scale-105"
            />
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#0f111c]" />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-base font-bold text-white hover:text-[#40c2fd] transition-colors cursor-pointer">
                {post.creator.name}
              </span>
              {post.creator.verified && (
                <CheckCircle2 className="w-4 h-4 text-[#40c2fd] shrink-0" />
              )}
              <span className="px-2 py-0.5 rounded-full bg-[#181d2f] border border-[#40c2fd]/30 text-[11px] font-mono font-medium text-[#40c2fd]">
                {post.categoryTag}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 mt-0.5">
              <span className="font-mono text-gray-300">{post.creator.handle}</span>
              <span>•</span>
              <span className="text-gray-400">{post.creator.roleLine}</span>
              <span>•</span>
              <span className="flex items-center gap-1 text-gray-400 font-mono">
                <Clock className="w-3 h-3" />
                {post.timeAgo}
              </span>
            </div>
          </div>
        </div>

        {/* Top-Right Category Pill / Options */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={onShare}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-[#161a28] transition-colors"
            title="Share"
            aria-label="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Post Title (H1) */}
      <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug mt-1">
        {post.title}
      </h1>

      {/* Summary Paragraph */}
      <p className="text-sm sm:text-base text-gray-300 leading-relaxed mt-3.5 font-normal">
        {post.summary}
      </p>

      {/* Hashtags Chips Row */}
      <div className="flex flex-wrap gap-2 mt-4">
        {post.hashtags.map((tag) => (
          <button
            key={tag}
            onClick={() => onSelectHashtag(tag)}
            className="flex items-center gap-1 px-3 py-1 rounded-full bg-[#141726] hover:bg-[#1c223a] border border-[#737686]/25 hover:border-[#40c2fd]/50 text-xs font-mono font-medium text-[#40c2fd] hover:text-white transition-all shadow-sm"
          >
            <Hash className="w-3 h-3 opacity-60" />
            <span>{tag.replace('#', '')}</span>
          </button>
        ))}
      </div>

      {/* Media Carousel (4 slides) */}
      <MediaCarousel
        slides={post.slides}
        onOpenLightbox={onOpenLightbox}
      />

      {/* Engagement Action Center */}
      <EngagementActionCenter
        initialLikes={post.stats.likes}
        commentsCount={commentsCount}
        initialReposts={post.stats.reposts}
        initialBookmarks={post.stats.bookmarks}
        views={post.stats.views}
        reactedAvatars={post.reactedAvatars}
        onScrollToComments={onScrollToComments}
        onShare={onShare}
        onNotify={onNotify}
      />
    </article>
  );
};
