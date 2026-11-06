import React, { useState } from 'react';
import {
  CheckCircle2,
  UserPlus,
  UserCheck,
  MapPin,
  TrendingUp,
  Heart,
  MessageSquare,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import type { Creator, CreatorPostItem } from '../types';

interface CreatorDossierCardProps {
  creator: Creator;
  morePosts: CreatorPostItem[];
  onNotify: (message: string) => void;
}

export const CreatorDossierCard: React.FC<CreatorDossierCardProps> = ({
  creator,
  morePosts,
  onNotify,
}) => {
  const [isFollowing, setIsFollowing] = useState(creator.isFollowing || false);
  const [followersCount, setFollowersCount] = useState(34812);

  const handleToggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setFollowersCount((prev) => prev - 1);
      onNotify(`Unfollowed ${creator.handle}`);
    } else {
      setIsFollowing(true);
      setFollowersCount((prev) => prev + 1);
      onNotify(`You are now following ${creator.name} ✨`);
    }
  };

  return (
    <div className="rounded-2xl bg-[#0f111c] border border-[#737686]/25 p-5 space-y-5 shadow-xl relative overflow-hidden">
      {/* Top Banner & Header */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-r from-[#004ac6]/30 via-[#1d68ff]/20 to-[#40c2fd]/30 pointer-events-none" />

      {/* Avatar + Follow Button Row */}
      <div className="relative pt-3 flex items-start justify-between">
        <div className="relative">
          <img
            src={creator.avatar}
            alt={creator.name}
            className="w-16 h-16 rounded-2xl object-cover ring-4 ring-[#0f111c] shadow-lg shadow-black/40"
          />
          <span className="absolute bottom-1 right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-2 ring-[#0f111c]" />
        </div>

        <button
          onClick={handleToggleFollow}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 shadow-md ${
            isFollowing
              ? 'bg-[#181b29] hover:bg-[#ab0b1c]/20 hover:text-[#ff2d55] text-emerald-400 border border-emerald-500/40'
              : 'bg-gradient-to-r from-[#004ac6] to-[#1d68ff] hover:from-[#1d68ff] hover:to-[#40c2fd] text-white shadow-[#004ac6]/30'
          }`}
        >
          {isFollowing ? (
            <>
              <UserCheck className="w-3.5 h-3.5" />
              <span>Following</span>
            </>
          ) : (
            <>
              <UserPlus className="w-3.5 h-3.5" />
              <span>Follow</span>
            </>
          )}
        </button>
      </div>

      {/* Name, Handle, Role, Location */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5">
          <h3 className="text-base font-bold text-white tracking-tight">
            {creator.name}
          </h3>
          {creator.verified && (
            <CheckCircle2 className="w-4 h-4 text-[#40c2fd] shrink-0" />
          )}
        </div>

        <p className="text-xs font-mono text-[#40c2fd]/90">
          {creator.handle}
        </p>

        <p className="text-xs font-medium text-gray-300">
          {creator.roleLine}
        </p>

        <div className="flex items-center gap-1 text-[11px] text-gray-400 pt-0.5">
          <MapPin className="w-3 h-3 text-gray-400" />
          <span>{creator.location}</span>
        </div>
      </div>

      {/* Bio */}
      <p className="text-xs text-gray-300 leading-relaxed font-normal">
        {creator.bio}
      </p>

      {/* Stats Strip: Followers / Following / Views */}
      <div className="grid grid-cols-3 gap-2 py-3 px-3 rounded-xl bg-[#131624] border border-[#737686]/20 text-center">
        <div>
          <span className="block text-sm font-bold font-mono text-white">
            {(followersCount / 1000).toFixed(1)}K
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
            Followers
          </span>
        </div>
        <div className="border-x border-[#737686]/20">
          <span className="block text-sm font-bold font-mono text-white">
            {creator.following}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
            Following
          </span>
        </div>
        <div>
          <span className="block text-sm font-bold font-mono text-[#40c2fd]">
            {creator.views}
          </span>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">
            Total Views
          </span>
        </div>
      </div>

      {/* Mutual Connections Line */}
      <div className="flex items-center gap-2.5 pt-1 text-[11px] text-gray-400">
        <div className="flex -space-x-2 shrink-0">
          {creator.mutuals.avatars.map((av, idx) => (
            <img
              key={idx}
              src={av}
              alt="Mutual"
              className="w-5 h-5 rounded-full object-cover ring-2 ring-[#0f111c]"
            />
          ))}
        </div>
        <span className="leading-tight text-gray-400">
          {creator.mutuals.text}
        </span>
      </div>

      {/* More from @marcus_dev List */}
      <div className="pt-2 border-t border-[#737686]/20 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-[#40c2fd]" />
            More from {creator.handle}
          </span>
          <span className="text-[10px] text-[#40c2fd] hover:underline cursor-pointer">
            View all
          </span>
        </div>

        <div className="space-y-2.5">
          {morePosts.map((post) => (
            <div
              key={post.id}
              onClick={() => onNotify(`Opened "${post.title.slice(0, 30)}..."`)}
              className="group/item flex items-center gap-3 p-2 rounded-xl bg-[#131624] hover:bg-[#181d2f] border border-[#737686]/15 hover:border-[#40c2fd]/40 transition-all cursor-pointer"
            >
              <img
                src={post.thumbnail}
                alt={post.title}
                className="w-12 h-12 rounded-lg object-cover ring-1 ring-white/10 shrink-0 group-hover/item:scale-105 transition-transform"
              />
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-gray-200 group-hover/item:text-[#40c2fd] transition-colors line-clamp-1 leading-snug">
                  {post.title}
                </h4>
                <div className="flex items-center gap-3 text-[10px] text-gray-400 mt-1">
                  <span>{post.timeAgo}</span>
                  <span className="flex items-center gap-1">
                    <Heart className="w-2.5 h-2.5 text-gray-400" />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageSquare className="w-2.5 h-2.5 text-gray-400" />
                    {post.comments}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
